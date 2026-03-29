import cron from "node-cron";
import db from "../../db";
import { logger } from "../../config/logger";
import { EmailProcessingPayload } from "../types";
import env from "../../config/env";
import { getEmailProcessingQueue } from "../queues/emailProcessingQueue";
import { resolve } from "dns";
const BATCH_SIZE = 100;
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const enqueueEmailJobsForAllUsers = async () => {
    try{
        let emailProcessingQueue = getEmailProcessingQueue();
        let skip = 0;
        let hasMore = true;
        while(hasMore){           
            const allInFlightJobs = await emailProcessingQueue.getJobs(['waiting','active']);
            const allUsersWithEmailAndCalendarAccounts = await db.user.findMany(
                {
                    where:{
                        isAutomationActive:true,
                        isActive:true,                       
                        emailAccounts:{
                            some:{isActive:true}
                        },
                        calendarAccounts:{
                            some:{isActive:true}
                        },
                        subscriptions:{
                            some:{
                                isActive:true,
                                endDate:{gte:new Date()}
                            }
                        }
                    },
                    take:BATCH_SIZE,
                    skip,
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        phone:true,
                        isActive:true,
                        isAutomationActive:true,
                        aiResponseTone:true,
                        lastAutomationRanAt:true,
                        emailAccounts:{
                            where:{isActive:true},
                            select:{
                                id:true,
                                emailAddress:true,
                                appPassword:true,
                                accessToken:true,
                                refreshToken:true,
                                smtpHost:true,
                                smtpPort:true,
                                imapHost:true,
                                imapPort:true,
                                provider:true,
                                priorityWeight:true
                            }
                        },
                        calendarAccounts:{
                            where:{isActive:true},
                            select:{
                                id:true,
                                emailAddress:true,
                                accessToken:true,
                                refreshToken:true,
                                provider:true,
                                isActive:true
                            }
                        },
                        subscriptions:{
                            where:{
                                isActive:true,
                                endDate:{
                                    gt: new Date()
                                }
                            },
                            orderBy:{
                                createdAt:"desc"
                            },
                            select:{
                                id:true,
                                userId:true,
                                planId:true,
                                gatewaySubscriptionId:true,
                                currentUsageCount:true,
                                startDate:true,
                                endDate:true,
                                isActive:true,
                                plan:true
                            }                           
                        }
                    }
                },
            );
            //if no users found, just stop there
            if(allUsersWithEmailAndCalendarAccounts.length === 0){            
                logger.info(`[EMAIL-PROCESSING-SCHEDULING] No users found to process, skipping schedular...`);
                hasMore=false;
                break;
            }            
            for(let eachUser of allUsersWithEmailAndCalendarAccounts){                                               
                if(eachUser.subscriptions[0].currentUsageCount >= eachUser.subscriptions[0].plan.quota){
                    logger.info(`[EMAIL-PROCESSING-SCHEDULING] Quota exhausted for current subscription for user with id ${eachUser.id}, skipping user...`);
                    continue;
                }
                const firstEverSubscription = await db.subscription.findFirst({
                    where:{
                        userId:eachUser.id
                    },
                    orderBy:{
                        createdAt:"asc"
                    },
                    select:{
                        startDate:true
                    }
                });
                if(!firstEverSubscription){
                    logger.info(`[EMAIL-PROCESSING-SCHEDULING] No subscription found of user with id ${eachUser.id}, skipping user...`);
                    continue;
                }
                const firstOnboardingDate = firstEverSubscription.startDate;
                //find in flight email processing jobs for the particular user
                const userInFlightJobs = allInFlightJobs.filter((each)=>{
                    return each.data.general_data.user_id === eachUser.id;
                });
                //find committed quota there in inflight jobs for the particular user
                const committedCount = userInFlightJobs.reduce((counter,each)=>{
                    return counter+=each.data.n8n_payload.process_quantity;
                },0);
                let leftQuota = eachUser.subscriptions[0].plan.quota - eachUser.subscriptions[0].currentUsageCount-committedCount;
                const totalEmailAccountPriorityWeight = eachUser.emailAccounts.reduce((counter,each)=>{
                    return counter + each.priorityWeight;
                },0);
                const currentBlock = Math.floor(Date.now()/FOUR_HOURS_MS);                        
                const queuAdditionJobs = eachUser.emailAccounts.map((eachEmailAccount)=>{
                    const throttle = Math.floor((eachEmailAccount.priorityWeight/totalEmailAccountPriorityWeight)*eachUser.subscriptions[0].plan.maxEmailsPerRun);
                    let processQuantity = Math.min(throttle,leftQuota);
                    if(processQuantity<= 0){
                        return new Promise((resolve)=>resolve(true))
                    }
                    leftQuota -= processQuantity;
                    const emailProcessingQueueData:EmailProcessingPayload = {
                        n8n_payload:{
                            process_quantity:processQuantity,
                            calendar_mail:eachUser.calendarAccounts[0].emailAddress,
                            calendar_refresh_token:eachUser.calendarAccounts[0].refreshToken ?? '',
                            calendar_provider:eachUser.calendarAccounts[0].provider, 
                            subscription_date:firstOnboardingDate,
                            google_project_client_id:env.GOOGLE_CLIENT_ID,
                            google_project_client_secret:env.GOOGLE_CLIENT_SECRET,
                            microsoft_project_client_id:env.MICROSOFT_CLIENT_ID,
                            microsoft_project_client_secret:env.MICROSOFT_CLIENT_SECRET,
                            microsoft_project_object_id:env.MICROSOFT_OBJECT_ID,             
                            subject_email:eachEmailAccount.emailAddress,
                            subject_provider:eachEmailAccount.provider,
                            subject_password:eachEmailAccount.appPassword ?? '',
                            subject_refresh_token:eachEmailAccount.refreshToken ?? '',
                            subject_imap_url:eachEmailAccount.imapHost ?? '',
                            subject_imap_port:eachEmailAccount.imapPort ?? 0,
                            subject_smtp_url:eachEmailAccount.smtpHost ?? '',
                            subject_smtp_port:eachEmailAccount.smtpPort ?? 0  
                        },
                        general_data:{
                            user_id:eachUser.id,
                            plan_id:eachUser.subscriptions[0].plan.id,
                            subscription_id:eachUser.subscriptions[0].id,
                            email_account_id:eachEmailAccount.id,
                            calendar_account_id:eachUser.calendarAccounts[0].id
                        }                                                
                    }
                    const isActiveJobPresent = allInFlightJobs.some((each)=>{
                        return (each.data.general_data.user_id === eachUser.id && each.data.general_data.email_account_id === eachEmailAccount.id)
                    });
                    if(isActiveJobPresent){
                        return new Promise((resolve)=>resolve(true));
                    }
                    return emailProcessingQueue.add('email-processing',emailProcessingQueueData,{
                        jobId:`${eachUser.id}-${eachEmailAccount.id}-${currentBlock}`
                    });
                });
                const queueAdditionResult = await Promise.allSettled(queuAdditionJobs);
                queueAdditionResult.forEach((res,idx)=>{
                    if(res.status === 'rejected'){
                        logger.error(`[EMAIL-PROCESSING-SCHEDULING] unable to add to email processing queue`,{
                            userId:eachUser.id,
                            emailAccountId:eachUser.emailAccounts[idx].emailAddress,
                            reason:res.reason
                        });   
                    }                    
                });       
            }
            skip+=BATCH_SIZE;
        }       
    }catch(err){
        logger.error(`[EMAIL-PROCESSING-SCHEDULING] Error while scheduling job`,{
            stack:err instanceof Error?err.stack:null
        });               
    }    
}

export const initEmailProcessorSchedular = () => {
    cron.schedule("0 */4 * * *",enqueueEmailJobsForAllUsers);  //0 */3 * * * this is for 3 hour interval  0 */4 * * *   this is for 4 hour interval */5 * * * *
    logger.info('[EMAIL-PROCESSOR-SCHEDULAR] scheduled');
}