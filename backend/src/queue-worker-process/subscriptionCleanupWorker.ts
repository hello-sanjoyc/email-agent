import { Job, Worker } from "bullmq";
import { logger } from "../config/logger";
import {redisConnection} from "../config/redis";
import db from "../db";

//function that defines the worker's actual work
const cleanExpiredSubscription = async (job:Job<null>):Promise<void> => {   
    try{        
        const expiredSubscriptions = await db.subscription.updateMany({
            where:{
                endDate:{
                    lt:new Date()
                },
                isActive:true
            },
            data:{
                isActive:false
            }
        });
        logger.info(`[SUBSCRIPTION CLEANUP] expiration justified`,{
            jobId:job.id,
            expirationCount:expiredSubscriptions.count
        });    
    }catch(err){
        throw err;
    }
}
//define worker variable and initialize with null once
let subscriptionCleanupWorker:Worker<null>|null= null;
//function to initialize worker instance and populate the worker variable with it
export const initSubscriptionCleanupWorker = () => {
    if(subscriptionCleanupWorker) return subscriptionCleanupWorker;
    subscriptionCleanupWorker = new Worker<null>(
        'subscription-cleanup',
        cleanExpiredSubscription,
        {
            connection:redisConnection,
            concurrency: 2
        }
    );

    subscriptionCleanupWorker.on('completed',(job)=>{
        logger.info(`[SUBSCRIPTION CLEANUP] successful`,{
            jobId:job.id
        });
    });
    subscriptionCleanupWorker.on('failed',(job,err)=>{
        logger.error(`[SUBSCRIPTION CLEANUP] failed`,{
            jobId:job?.id,
            message:err.message,
            stack:err.stack
        });
    });
    subscriptionCleanupWorker.on('error',(err)=>{
        logger.error(`[SUBSCRIPTION CLEANUP] Error initializing the worker`,{
            message:err.message,
            stack:err.stack
        });
    });
}
//function to close the worker instance and make the worker variable null again
export const closeSubscriptionCleanupWorker = async () => {
    if(subscriptionCleanupWorker){
        await subscriptionCleanupWorker.close();
        subscriptionCleanupWorker = null;
    }
}