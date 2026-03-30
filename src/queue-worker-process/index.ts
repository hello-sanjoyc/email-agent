import { logger } from "../config/logger";
import { closeEmailProcessorWorker, initEmailProcessorWorker } from "./emailProcessorWorker";
import { closeEmailSenderWorker, initEmailSenderWorker } from "./emailSenderWorker";
import { closeRazorpayWebhookProcessorWorker, initRazorpayWebhookProcessorWorker } from "./razorpayWebhookProcessorWorker";
import { closeSubscriptionCleanupWorker, initSubscriptionCleanupWorker } from "./subscriptionCleanupWorker";

export const startQueueWorkerProcess = () => {
    
    //INIT THE BULLMQ WORKERS(ALWAYS AFTER CHECKING THE REDIS CONNECTIVITY)
    initEmailProcessorWorker();
    initEmailSenderWorker();
    initRazorpayWebhookProcessorWorker();
    initSubscriptionCleanupWorker();
    logger.info(`[QUEUE WORKER PROCESS] started`);
}

export const stopQueueWorkerProcess =async () => {
    await Promise.all([
        closeEmailSenderWorker(),
        closeEmailProcessorWorker(),
        closeSubscriptionCleanupWorker(),
        closeRazorpayWebhookProcessorWorker()
    ]);                
    logger.info('[BULLMQ WORKERS] closed');
}