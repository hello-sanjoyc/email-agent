import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError.utils";
import { fetchActiveSubscriptionPlan, fetchAllSubscriptionPlans, fetchSelectedSubscriptionPlan, generateSubscription, registerNewSubscriptionPlan } from "../../services/finance.service";
import { CreateEnquiryInput } from "./types";
import { generateEnquiry } from "../../services/common.service";
import { EmailSendQueuePayload } from "../../../queues/types";
import enquiryTemplate from "../../../mail/templates/enquiry.template";
import { getEmailSendingQueue } from "../../../queues/emailSendingQueue";
import env from "../../../config/env";

//to get the profile details of a logged in user
export const createEnquiry = async (req:Request,res:Response,next:NextFunction)=>{
    try{        
        const input = req.body as CreateEnquiryInput;
        await generateEnquiry(input);
        const templateData = {
            full_name:input.full_name,
            email:input.email,
            phone:input.phone,
            company:input.company,
            message:input.message,
            submittedAt:new Date().toISOString()
        };
        const queueData:EmailSendQueuePayload = {
            subject:"EMA-New Enquiry Received",
            to:env.ADMIN_EMAIL,
            content:enquiryTemplate(templateData)
        };
        const emailSendingQueue = getEmailSendingQueue();
        await emailSendingQueue.add('email-sending',queueData);
        return res.status(200).json({
            error:false,
            message:'Enquiry submitted'
        });
    }catch(err){
        next(err);
    }
}