import { VerifySubscriptionInput } from "../controllers/v1/types";
import db from "../db";
import AppError from "../utils/appError.utils";
import { ActiveSubscriptionPlanData, NewSubscriptionDataset, SubscriptionCreationDataset, SubscriptionPlanData } from "./types";

export const fetchAllSubscriptionPlans = async ():Promise<SubscriptionPlanData[]> => {
    try{
        const plans = await db.subscriptionPlan.findMany({
            select:{
                id:true,
                name:true,
                quota:true,
                price:true,
                gatewayPlanId:true,
                billingInterval:true,
                gatewayCustomerNotify:true,
                gatewayTotalCount:true
            }
        });
        return plans;
    }catch(err){
        throw err;
    }
}
export const fetchActiveSubscriptionPlan = async (userId:string):Promise<ActiveSubscriptionPlanData | null> => {
    try{
        const activePlanData = await db.subscription.findFirst({
            orderBy:{
                createdAt:'desc'
            },
            where:{userId,isActive:true,endDate:{gte:new Date()}},
            select:{
                id:true,
                userId:true,
                planId:true,
                currentUsageCount:true,
                startDate:true,
                endDate:true,
                gatewaySubscriptionId:true,
                user:{
                    select:{
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        isActive: true,
                        isAutomationActive:true,
                        aiResponseTone:true,
                        lastAutomationRanAt:true,
                        createdAt: true  
                    }
                },
                plan:{
                    select:{
                        id:true,
                        name:true,
                        quota:true,
                        price:true,
                        gatewayPlanId:true,
                        billingInterval:true,
                        gatewayCustomerNotify:true,
                        gatewayTotalCount:true
                    }
                },
            }
        });
        return activePlanData;
    }catch(err){
        throw err;
    }
}

export const fetchSelectedSubscriptionPlan = async (id:string):Promise<SubscriptionPlanData | null> => {
     try{
        const plan = await db.subscriptionPlan.findFirst({
            where:{id},
            select:{
                id:true,
                name:true,
                quota:true,
                price:true,
                gatewayPlanId:true,
                billingInterval:true,
                gatewayCustomerNotify:true,
                gatewayTotalCount:true
            }
        });
        return plan;
    }catch(err){
        throw err;
    }
}

export const generateSubscription = async (subscriptionDataset:SubscriptionCreationDataset):Promise<NewSubscriptionDataset> => {
    try{
        const newSubscriptionData = await db.subscription.create({
            data:subscriptionDataset
        });
        return newSubscriptionData; 
    }catch(err){
        throw err;
    }
}

export const registerNewSubscriptionPlan = async (apiInput:VerifySubscriptionInput,userId:string):Promise<string | null> => {
    try{
        const lastGatewaySubscriptionId = await db.$transaction(async(tx)=>{
            //set an initial value of the rolledOver quota
            let rolledOverQuota = 0;
            let lastGatewaySubscriptionId = null;
           //check if internal subscription id is actually of any valid subscription or not
           const concernedSubscription = await tx.subscription.findUnique({
            where:{id:apiInput.internal_subscription_id},
            include:{plan:true}
           });
           if(!concernedSubscription || concernedSubscription.userId !== userId || concernedSubscription.gatewaySubscriptionId !== apiInput.razorpay_subscription_id) throw new AppError("Invalid current subscription, contact authority",400);
           //find last active plan if any(the one whose is_active is true and also endDate does not pass yet)
           const lastActiveSubscription = await tx.subscription.findFirst({
                where:{
                    isActive:true,
                    userId,
                    id: { not: apiInput.internal_subscription_id },
                    endDate:{gt:new Date()}
                },
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    plan:true
                }
           });
           //if last active plan present, update the rolled over quota based on that plan's remaining quota
           if(lastActiveSubscription && lastActiveSubscription.plan.billingInterval !=="TRIAL"){
                rolledOverQuota = Math.max(0,(lastActiveSubscription.plan.quota - lastActiveSubscription.currentUsageCount));
                lastGatewaySubscriptionId = lastActiveSubscription.gatewaySubscriptionId;                
           }          
           //mark all current active subscriptions as is_active false
           await tx.subscription.updateMany({
                where:{
                    userId,
                    isActive:true
                },
                data:{
                    isActive:false
                }
           });
            //update your last created subscription that you created before going to payment gateway and mark it as is_active=true and adjust the quota too
            await tx.subscription.update({
                where:{
                    id:apiInput.internal_subscription_id
                },
                data:{
                    currentUsageCount:(0 - rolledOverQuota),                    
                    isActive:true
                }
            });
            //create a payment table entry for the newly created subscription 
            await tx.payment.create({
                data:{
                    userId,
                    subscriptionId:apiInput.internal_subscription_id,
                    amount:concernedSubscription.plan.price,
                    status:"SUCCESS",
                    gatewayOrderId:apiInput.razorpay_subscription_id,
                    gatewayPaymentId:apiInput.razorpay_payment_id,
                    gatewaySignature:apiInput.razorpay_signature
                }
            });
            return lastGatewaySubscriptionId;
        });
        return lastGatewaySubscriptionId;
    }catch(err){
        throw err;
    }
}

export const handleRazorpayChargedEvent = async (
    rzpSubscriptionId:string,rzpPaymentId:string,rzpPrice:number,
    rzpSubscriptionStartSeconds:number,rzpSubscriptionEndSeconds:number
) => {
    try{
        const chargedSubscriptionData = await db.$transaction(async (tx) => {
            const subscriptionData = await tx.subscription.findFirst({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId,
                },
                orderBy:{
                    createdAt:"desc"
                },
                select:{
                    id:true,
                    userId:true,
                    currentUsageCount:true,
                    plan:true,
                    user:true,
                    _count:{
                        select:{
                            payments:true
                        }
                    },
                    payments:{
                        where:{
                            gatewayPaymentId:rzpPaymentId
                        }
                    }
                }
            });
            if(!subscriptionData){
                throw new Error("No existing subscription");
            };
            if(subscriptionData.payments.length >= 1){
                throw new Error("No action needed, charging entry already exists");
            };
            if(!subscriptionData.plan){
                throw new Error("No existing subscription plan");
            }; 
            if(Number(subscriptionData.plan.price) !== (rzpPrice/100)){
                throw new Error("Price Mismatch");
            }                                                     
            await tx.subscription.update({
                where:{
                    id:subscriptionData.id
                },
                data:{
                    isActive:true,
                    startDate:new Date(rzpSubscriptionStartSeconds * 1000),
                    endDate:new Date(rzpSubscriptionEndSeconds * 1000),                           
                    ...(subscriptionData._count.payments > 0 && {currentUsageCount:0})
                }
            });                    
            await tx.payment.create({
                data:{
                    userId:subscriptionData.userId,
                    subscriptionId:subscriptionData.id,
                    amount:subscriptionData.plan.price,
                    status:"SUCCESS",
                    gatewayOrderId:rzpSubscriptionId,
                    gatewaySignature:"RZP_RECURRING_WEBHOOK"
                }
            });
            return subscriptionData;
        });
        return chargedSubscriptionData;
    }catch(err){
        throw err;
    }
}

export const handleRazorpayActivatedEvent = async (rzpSubscriptionId:string) => {
    try{
        const activatedSubscriptionData = await db.$transaction(async (tx) => {
            const subscriptionData = await tx.subscription.findUnique({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                select:{
                    id:true,
                    user:true,
                    plan:true,
                }
            });
            if(!subscriptionData){
                throw new Error("No action needed, no subscription found to activate");
            }
            await tx.subscription.update({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                data:{
                    isActive:true
                }
            });
            return subscriptionData;
        });
        return activatedSubscriptionData;
    }catch(err){
        throw err;
    }
}

export const handleRazorpayHaltedEvent = async (rzpSubscriptionId:string) => {
    try{
        const haltedSubscriptionData = await db.$transaction(async (tx) => {
            const subscriptionData = await tx.subscription.findUnique({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                select:{
                    id:true,
                    user:true,
                    plan:true
                }
            });
            if(!subscriptionData){
                throw new Error("No action needed, no subscription found to halt");
            }
            await tx.subscription.update({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                data:{
                    isActive:false
                }
            });
            return subscriptionData;
        });
        return haltedSubscriptionData;
    }catch(err){
        throw err;
    }
}

export const handleRazorpayCancelledEvent = async (rzpSubscriptionId:string) => {
    try{
        const cancelledSubscriptionData = await db.$transaction(async (tx) => {
            const subscriptionData = await tx.subscription.findUnique({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                select:{
                    id:true,
                    user:true,
                    plan:true
                }
            });
            if(!subscriptionData){
                throw new Error("No action needed, no subscription found to cancel");
            }
            await tx.subscription.update({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId
                },
                data:{
                    isActive:false
                }
            });
            return subscriptionData;
        });
        return cancelledSubscriptionData;
    }catch(err){
        throw err;
    }
}