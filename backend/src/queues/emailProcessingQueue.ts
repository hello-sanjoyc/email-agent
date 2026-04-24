import { Queue } from "bullmq";
import { EmailProcessingPayload } from "../types/types";
import { logger } from "../config/logger";
import {redisConnection} from "../config/redis";
export let emailProcessingQueue:Queue<EmailProcessingPayload>;
export const initEmailProcessingQueue = () => {
    emailProcessingQueue = new Queue<EmailProcessingPayload>('email-processing',{
        connection:redisConnection,
        defaultJobOptions:{
            attempts:3,
            backoff:{type:'exponential',delay:5000},
            removeOnComplete:{count:100,age:24 * 3600},
            removeOnFail:200
        }
    });
    emailProcessingQueue.on('error',(err)=>{
        logger.error('[QUEUE INITIATION] failed',{
            type:'email-processing',
            message:err.message,
            stack:err.stack
        });
    });
}
export const getEmailProcessingQueue = () => {
    if(!emailProcessingQueue) throw new Error('[QUEUE INITIALIZATION] error(email processing queue)');
    return emailProcessingQueue;
}
export const closeEmailProcessingQueue = async () => {
    if (emailProcessingQueue) {
        await emailProcessingQueue.close();       
        (emailProcessingQueue as any) = null; 
    }
};