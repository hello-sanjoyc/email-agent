import { Queue } from "bullmq";
import { RazorpayJobPayload } from "./types";
import { redisConnection } from "../config/redis";
import { logger } from "../config/logger";

let razorpayWebhookProcessingQueue:Queue<RazorpayJobPayload>
export const initRazorpayWebhookProcessingQueue = () => {
    razorpayWebhookProcessingQueue = new Queue<RazorpayJobPayload>(
        "razorpay-webhook-processing",
        {
            connection:redisConnection,
            defaultJobOptions:{
                attempts:3,
                backoff:{type:"exponential",delay:5000},
                removeOnComplete:100,
                removeOnFail:500
            }
        }        
    );
    razorpayWebhookProcessingQueue.on('error',(err)=>{
        logger.error('[QUEUE INITIATION] failed',{
            type:'razorpay-webhook-processing',
            message:err.message,
            stack:err.stack
        });
    });
}
export const getRazorpayWebhookProcessingQueue = () => {
    if(!razorpayWebhookProcessingQueue) throw new Error("[QUEUE INITIALIZATION] error (razorpay webhook processing)");
    return razorpayWebhookProcessingQueue;
}
export const closeRazorpayWebhookProcessingQueue = async () => {
    if (razorpayWebhookProcessingQueue) {
        await razorpayWebhookProcessingQueue.close();        
        (razorpayWebhookProcessingQueue as any) = null; 
    }
};