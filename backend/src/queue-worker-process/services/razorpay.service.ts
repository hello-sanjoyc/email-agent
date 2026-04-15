import db from "../../db";

export const handleRazorpayChargedEvent = async (
    rzpSubscriptionId:string,rzpPaymentId:string,rzpPrice:number,
    rzpSubscriptionStartSeconds:number,rzpSubscriptionEndSeconds:number
) => {
    try{
        const chargedSubscriptionData = await db.$transaction(async (tx) => {
            const subscriptionData = await tx.subscription.findUnique({
                where:{
                    gatewaySubscriptionId:rzpSubscriptionId,
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
                    gatewaySignature:"RZP_RECURRING_WEBHOOK",
                    gatewayPaymentId:rzpPaymentId
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