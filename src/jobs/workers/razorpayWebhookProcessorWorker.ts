import { Job, Worker } from "bullmq";
import { RazorpayJobPayload } from "../../controllers/v1/types";
import { redisConnection } from "../../config/redis";
import { logger } from "../../config/logger";
import subscriptionRenewalTemplate from "../../mail/templates/subscriptionRenewal.template";
import { getEmailSendingQueue } from "../queues/emailSendingQueue";
import subscriptionHaltedTemplate from "../../mail/templates/subscriptionHalted.template";
import subscriptionCancelledTemplate from "../../mail/templates/subscriptionCancelled.template";
import subscriptionActivatedTemplate from "../../mail/templates/subscriptionActivated.template";
import { handleRazorpayActivatedEvent, handleRazorpayCancelledEvent, handleRazorpayChargedEvent, handleRazorpayHaltedEvent } from "../../services/finance.service";
import razorpay from "../../config/razorpay";
import env from "../../config/env";

let razorpayWebhookProcessorWorker:Worker<RazorpayJobPayload>|null = null;
const razorpayWebhookProcessor =async (job:Job<RazorpayJobPayload>):Promise<void> => {
    logger.info(`[RAZORPAY WEBHOOK PROCESSING] processing a job`,{jobId:job.id});
    try{
        const event = job.data.event;
        const rzpSubscriptionId = job.data.payload.subscription.entity.id;
        const rzpPaymentId = job.data.payload.payment?.entity.id;
        const rzpSubscriptionStartSeconds = job.data.payload.subscription.entity.current_start;
        const rzpSubscriptionEndSeconds = job.data.payload.subscription.entity.current_end;
        const rzpPrice = job.data.payload.payment?.entity.amount;
        const emailSendingQueue = getEmailSendingQueue();
        switch(event){
            case "subscription.charged":
                if(!rzpPrice){
                    throw new Error("Invalid Price");
                }
                if(!rzpSubscriptionStartSeconds || !rzpSubscriptionEndSeconds){
                    throw new Error("start and end date missing");
                }
                if(!rzpPaymentId){
                    throw new Error("invalid payment ID");
                } 
                const subscriptionData = await handleRazorpayChargedEvent(rzpSubscriptionId,rzpPaymentId,rzpPrice,rzpSubscriptionStartSeconds,rzpSubscriptionEndSeconds,);
                const nextDateFormatted = new Date(rzpSubscriptionEndSeconds * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                const emailContent = subscriptionRenewalTemplate(
                    subscriptionData.user.name, 
                    subscriptionData.plan.name, 
                    `₹${rzpPrice / 100}`, 
                    nextDateFormatted
                );

                await emailSendingQueue.add('email-sending', {
                    to: subscriptionData.user.email,
                    subject: `Subscription Renewed: ${subscriptionData.plan.name}`,
                    content: emailContent
                });                
                break;
            case "subscription.activated":
                const activatedSubscriptionData = await handleRazorpayActivatedEvent(rzpSubscriptionId);
                await emailSendingQueue.add("email-sending",{
                    to:activatedSubscriptionData.user.email,
                    subject:"Congrats: Your subscription plan is activated",
                    content:subscriptionActivatedTemplate(activatedSubscriptionData.user.name,activatedSubscriptionData.plan.name,[
                        "Email processor"
                    ])
                });                
                break;
            case "subscription.halted":
                const rzpSub = (await razorpay.subscriptions.fetch(rzpSubscriptionId));
                const razorpayBillingUrl = rzpSub.short_url || `${env.FRONTEND_URL}/billings`
                const haltedSubscriptionData = await handleRazorpayHaltedEvent(rzpSubscriptionId);                
                await emailSendingQueue.add('email-sending', {
                    to: haltedSubscriptionData.user.email,
                    subject: "Urgent: Your subscription payment failed",
                    content: subscriptionHaltedTemplate(haltedSubscriptionData.user.name || 'User', haltedSubscriptionData.plan.name, razorpayBillingUrl)
                }); 
                break;
            case "subscription.cancelled":
                const cancelledSubscriptionData = await handleRazorpayCancelledEvent(rzpSubscriptionId);
                await emailSendingQueue.add(
                    'email-sending',
                    {
                        to:cancelledSubscriptionData.user.email,
                        subject:"Urgent: Your subscription is cancelled",
                        content:subscriptionCancelledTemplate(cancelledSubscriptionData.user.name,cancelledSubscriptionData.plan.name)
                    }
                ); 
                break;        
            default:
                logger.warn("[RAZORPAY WEBHOOK PROCESSING] invalid event",{jobId:job.id,event});
        }        
    }catch(err){        
        throw err;
    }    
}
export const initRazorpayWebhookProcessorWorker = () => {
    razorpayWebhookProcessorWorker = new Worker<RazorpayJobPayload>(
        "razorpay-webhook-processing",
        razorpayWebhookProcessor,
        {
            connection:redisConnection,
            concurrency:5
        }
    );
    razorpayWebhookProcessorWorker.on('completed',(job)=>{
        logger.info(`[RAZORPAY WEBHOOK PROCESSING] completed`,{
            jobId:job.id
        });
    });
    razorpayWebhookProcessorWorker.on('failed',(job,err)=>{
        logger.error(`[RAZORPAY WEBHOOK PROCESSING] failed`,{
            jobId:job?.id,
            message:err.message,
            stack:err.stack
        });
    });
    razorpayWebhookProcessorWorker.on('error',(err)=>{
        logger.error(`[RAZORPAY WEBHOOK PROCESSING] Error starting worker`,{
            message:err.message,
            stack:err.stack
        });
    });
}