import { Queue } from "bullmq";
import { EmailSendQueuePayload } from "./types";
import { logger } from "../config/logger";
import { redisConnection } from "../config/redis";
export let emailSendingQueue:Queue<EmailSendQueuePayload>;
export const initEmailSendingQueue = () => {
    emailSendingQueue = new Queue<EmailSendQueuePayload>('email-sending',{
        connection:redisConnection,
        defaultJobOptions:{
            attempts:3,
            backoff:{type:'exponential',delay:5000},
            removeOnComplete:100,
            removeOnFail:500
        }
    });

    emailSendingQueue.on('error',(err)=>{
        logger.error('[QUEUE INITIALIZATION] failed',{
            type:'email-sending',
            message:err.message,
            stack:err.stack
        });
    });
}
export const getEmailSendingQueue = () => {
    if(!emailSendingQueue) throw new Error('[QUEUE INITIALIZATION] error (email sending queue)');
    return emailSendingQueue;
}
export const closeEmailSendingQueue = async () => {
    if (emailSendingQueue) {
        await emailSendingQueue.close();       
        (emailSendingQueue as any) = null; 
    }
};