import { Worker, Job } from "bullmq";
import { EmailActivityCreationDataset } from "./types";
import { EmailProcessingPayload } from "../types/types";
import { logger } from "../config/logger";
import {redisConnection} from "../config/redis";
import db from "../db";
import { processEmail } from "./services/mail-processing";
import { ActionResultBagItem } from "./services/mail-processing/types";
import { ActionItemPriority } from "../generated/prisma";

const WORKER_CONCURRENCY = 5;
//worker function for the email processing worker
const processEmailJobs = async (job:Job<EmailProcessingPayload>):Promise<void> => {    
    try{      
        //calling the process mail service function, which is the mail email processing function       
        const response =await processEmail(job.data);
        //see if error came during processing
        if(response.error){
            throw response.errorObj;
        }
        //get the actionresult array containing action result for the messages
        let responseData:ActionResultBagItem[]=response.data;
        //prepare the multi dataset variable for insertion in email_activities table
        let emailActivityMultiDataset:EmailActivityCreationDataset[]=[];
        //count the messages the action against which, is completed, need for the increment in subscription
        let completedActionCount = responseData.filter((each)=>each.isCompleted === true).length;
        //prepare multi dataset for email activity table insertion
        for(let eachMessageResult of responseData){   
            emailActivityMultiDataset.push({
                userId:job.data.general_data.user_id,
                subscriptionId:job.data.general_data.subscription_id,
                planId:job.data.general_data.plan_id,
                emailAccountId:job.data.general_data.email_account_id,
                calendarAccountId:job.data.general_data.calendar_account_id,
                messageId:eachMessageResult.messageID,
                action:eachMessageResult.action,
                reason:eachMessageResult.reason,
                isCompleted:eachMessageResult.isCompleted,
                processedAt:new Date()
            });
        }
        //if we receive any action array at all, we will go for some insert and update operation
        if(responseData.length > 0){
            await db.$transaction(async (tx)=>{
                //insert each of the email activities separately, to get the inserted data
                const createdActivities = await Promise.all(
                    emailActivityMultiDataset.map((each)=>tx.emailActivity.create({data:each}))
                );
                const actionItemsToInsert = createdActivities.flatMap((createdActivity) => {
                    const matchingResult = responseData.find(
                        (r) => r.messageID === createdActivity.messageId
                    );
                    if (!matchingResult || matchingResult.actionItems.length === 0) {
                        return []; // flatMap skips empty arrays, so this message is just ignored
                    }
                    return matchingResult.actionItems.map((item) => ({
                        emailActivityId: createdActivity.id,
                        summary: item.summary,
                        deadline: item.deadline ? new Date(item.deadline) : null,
                        // The AI returns lowercase ("high") but Prisma enum is uppercase (HIGH)
                        priority: item.priority.toUpperCase() as ActionItemPriority,
                        status: 'PENDING' as const,
                    }));
                });
                 if (actionItemsToInsert.length > 0) {
                    await tx.actionItem.createMany({
                        data: actionItemsToInsert,
                    });
                }
                if(job.data.general_data.subscription_id && job.data.general_data.plan_id){
                    //update count for those actions which are performed successfully(completed)
                    await tx.subscription.update({
                        where:{
                            id:job.data.general_data.subscription_id
                        },
                        data:{
                            currentUsageCount:{
                                increment:completedActionCount
                            }
                        }
                    });
                }                
                
                await tx.user.update({
                    where:{id:job.data.general_data.user_id},
                    data:{
                        lastAutomationRanAt:new Date()
                    }
                });
            });
        }else{
            logger.info(`[EMAIL-PROCESSING-WORKER] no message activity to add`,{
                jobId:job.id,
                userId:job.data.general_data.user_id
            });
        }       
    }catch(err){                
        throw err;
    }
}
//init the worker variable with null value
let emailProcessorWorker:Worker<EmailProcessingPayload>|null = null;
//function to initialize the worker
export const initEmailProcessorWorker = () => {
    if(emailProcessorWorker) return emailProcessorWorker;
    emailProcessorWorker = new Worker<EmailProcessingPayload>(
        'email-processing',
        processEmailJobs,
        {
            connection:redisConnection,
            concurrency:WORKER_CONCURRENCY
        }
    )
    emailProcessorWorker.on('completed',(job)=>{
        logger.info(`[EMAIL-PROCESSING-WORKER] worker successfully completed a job`,{
            jobId:job.id,
            user_id:job.data.general_data.user_id
        });
    });
    emailProcessorWorker.on('failed',(job,err)=>{
        logger.error('[EMAIL-PROCESSING-WORKER] worker failed',{
            jobId:job?.id,
            userId:job?.data.general_data.user_id,
            message:err.message,
            stack:err.stack
        });
    });
    emailProcessorWorker.on('error',(err)=>{
        logger.error('[EMAIL-PROCESSING-WORKER] worker initialization error',{
            message:err.message,
            stack:err.stack
        });
    });
    return emailProcessorWorker;
}
//function to close the worker and make the variable null again
export const closeEmailProcessorWorker = async () => {
    if(emailProcessorWorker){
        await emailProcessorWorker.close();
        emailProcessorWorker = null;
    }
}