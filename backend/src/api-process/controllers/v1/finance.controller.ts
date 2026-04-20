import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError.utils";
import { fetchActiveSubscriptionPlan, fetchAllSubscriptionPlans, fetchSelectedSubscriptionPlan, generateSubscription, registerNewSubscriptionPlan } from "../../services/finance.service";
import { CreateSubscriptionInput, RazorpayJobPayload, VerifySubscriptionInput } from "./types";
import razorpay from "../../../config/razorpay";
import { SubscriptionCreationDataset } from "../../services/types";
import env from "../../../config/env";
import crypto from 'crypto';
import { logger } from "../../../config/logger";
import { getRazorpayWebhookProcessingQueue } from "../../../queues/razorpayWebhookProcessingQueue";

//to get the profile details of a logged in user
export const getSubscriptionPlans = async (req:Request,res:Response,next:NextFunction)=>{
    try{        
        const plans = await fetchAllSubscriptionPlans();
        return res.status(200).json({
            error:false,
            message:'Subscription plans fetched',
            data:plans
        });
    }catch(err){
        next(err);
    }
}
export const getCurrentSubscriptionPlan = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        const activePlan = await fetchActiveSubscriptionPlan(userId);
        return res.status(200).json({
            error:false,
            message:"Active subscription plan fetched",
            data:activePlan
        });
    }catch(err){
        next(err);
    }
}
export const createSubscription =async (req:Request, res:Response,next:NextFunction) => {
    try{
        const input = req.body as CreateSubscriptionInput;
        const userId = req.user?.id;
        //check if a user id is there
        if(!userId) throw new AppError("Invalid user",400);
        //get the selected plan
        const selectedPlan = await fetchSelectedSubscriptionPlan(input.planId);
        if(!selectedPlan || !selectedPlan.gatewayPlanId) throw new AppError("Invalid plan selected",400);
        //no one should select the trial plan here
        if(selectedPlan.billingInterval === "TRIAL") throw new AppError("Invalid plan selected",400);
        //selected plan should have the total count, gateway plan id and customer notify values present
        if(!selectedPlan.gatewayPlanId || !selectedPlan.gatewayTotalCount || !selectedPlan.gatewayCustomerNotify){
            throw new AppError("Invalid plan selected",400);
        }        
        const newSubscriptionData = await razorpay.subscriptions.create({
            plan_id:selectedPlan.gatewayPlanId,
            total_count:selectedPlan.gatewayTotalCount,
            customer_notify: selectedPlan.gatewayCustomerNotify == 1,
        });;
        
        //generate subscription dataset        
        const startDate = new Date();
        const endDate = new Date();
        if(selectedPlan.billingInterval === 'YEAR'){
            endDate.setFullYear(startDate.getFullYear() + 1);
        }else if(selectedPlan.billingInterval === 'MONTH'){
            endDate.setMonth(startDate.getMonth() + 1);
        }else{
            throw new AppError("Invalid billing interval",400);
        }
        const subscriptionDataset:SubscriptionCreationDataset = {    
            userId:userId,
            planId:selectedPlan.id,
            gatewaySubscriptionId:newSubscriptionData.id,
            currentUsageCount:0,
            startDate:startDate,
            endDate:endDate,
            isActive:false    
        }
        const newSubscriptionTableData = await generateSubscription(subscriptionDataset);
        return res.status(200).json({
            error:false,
            message:"Subscription initialized",
            data:{
                gatewaySubscriptionId:newSubscriptionData.id,
                internalSubscriptionId:newSubscriptionTableData.id               
            }
        });
    }catch(err){
        console.log(err);
        next(err);
    }
}
export const verifySubscription = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as VerifySubscriptionInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const razorpaySecret = env.RAZORPAY_SECRET;
        if(!razorpaySecret) throw new AppError("Server Misconfiguration",500);
        const signature = crypto.createHmac("sha256",razorpaySecret)
        .update(`${input.razorpay_payment_id}|${input.razorpay_subscription_id}`)
        .digest("hex");
        if(input.razorpay_signature !== signature) throw new AppError("Signature mismatch",400);
        const result = await registerNewSubscriptionPlan(input,userId);
        if(result){
           try{
            await razorpay.subscriptions.cancel(result);
           }catch(e){
            logger.warn("unable to cancel old subscription",{
                userId,result,
            });
           } 
        }        
        //send response
        return res.status(200).json({
            error:false,
            message:"Your plan is active now",
            data:result
        });
    }catch(err){
        next(err);
    }
}
export const respondToWebhook = async (req:Request,res:Response,next:NextFunction) => {
    try{
        logger.info("[webhook-request] data received",{
            data:req.body
        });
        const requestSignature = req.headers["x-razorpay-signature"] as string;
        const razorpaySecret = env.RAZORPAY_WEBHOOK_SECRET;
        const rawBody = req.rawBody;
        if(!rawBody) throw new AppError("Invalid Request",400);
        if(!razorpaySecret) throw new AppError("Server Misconfiguration",400);   
        const payloadSignature = crypto.createHmac("sha256",razorpaySecret).update(rawBody).digest("hex");
        if(payloadSignature !== requestSignature) throw new AppError("Invalid signature",400);
        const payloadObject = JSON.parse(rawBody.toString()) as RazorpayJobPayload;
        const razorpayWebhookProcessingQueue = getRazorpayWebhookProcessingQueue();
        await razorpayWebhookProcessingQueue.add("razorpay-webhook-processing",payloadObject);
        return res.status(200).send("OK");       
    }catch(err){
        logger.error("[webhook request] falied",{
            data:err instanceof Error? err.message:"",
        });
        next(err);
    }
}



