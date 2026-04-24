import { Job, Worker } from "bullmq";
import { EmailSendQueuePayload } from "./types";
import env from "../config/env";
import { logger } from "../config/logger";
import { mailer } from "../config/mailer";
import {redisConnection} from "../config/redis";

//function that defines the worker's actual work
const sendEmail = async (job:Job<EmailSendQueuePayload>):Promise<void> => {   
    const result = await mailer.sendMail({
        to:job.data.to,
        from:env.APP_MAIL,
        html:job.data.content,
        subject:job.data.subject
    });
    logger.info(`[EMAIL SENDING] mail sent for job id ${job.id}`,{email:job.data.to,result});    
}
//define worker variable and initialize with null once
let emailSenderWorker:Worker<EmailSendQueuePayload>|null= null;
//function to initialize worker instance and populate the worker variable with it
export const initEmailSenderWorker = () => {
    if(emailSenderWorker) return emailSenderWorker;
    emailSenderWorker = new Worker<EmailSendQueuePayload>(
        'email-sending',
        sendEmail,
        {
            connection:redisConnection,
            concurrency: 2
        }
    );

    emailSenderWorker.on('completed',(job)=>{
        logger.info(`[EMAIL SENDING] Job with id ${job.id} successfully completed for mail sending`);
    });
    emailSenderWorker.on('failed',(job,err)=>{
        logger.error(`[EMAIL SENDING] Job with id ${job?.id} failed for mail sending`,{
            message:err.message,
            stack:err.stack
        });
    });
    emailSenderWorker.on('error',(err)=>{
        logger.error(`[EMAIL SENDING] Error while processing job for mail sending`,{
            message:err.message,
            stack:err.stack
        });
    });
}
//function to close the worker instance and make the worker variable null again
export const closeEmailSenderWorker = async () => {
    if(emailSenderWorker){
        await emailSenderWorker.close();
        emailSenderWorker = null;
    }
}