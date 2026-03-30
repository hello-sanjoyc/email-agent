import { Queue } from "bullmq";
import { logger } from "../config/logger";
import {redisConnection} from "../config/redis";
let subscriptionCleanupQueue:Queue<null> | null = null;
export const initSubscriptionCleanupQueue = async () => {
    subscriptionCleanupQueue = new Queue<null>('subscription-cleanup',{
        connection:redisConnection,
        defaultJobOptions:{
            attempts:3,
            backoff:{type:'exponential',delay:5000},
            removeOnComplete:100,
            removeOnFail:500
        }
    });
    subscriptionCleanupQueue.on('error',(err)=>{
        logger.error('[QUEUE INITIATION] failed',{
            type:'subscription-cleanup',
            message:err.message,
            stack:err.stack
        });
    });
    await subscriptionCleanupQueue.add('subscription-cleanup',null,{
        jobId:'reconciliation-schedule',
        repeat:{pattern:'1 0 * * *'}
    });
}
export const closeSubscriptionCleanupQueue = ()=>{
    if(subscriptionCleanupQueue){
        subscriptionCleanupQueue.close();
        subscriptionCleanupQueue = null;
    }
}