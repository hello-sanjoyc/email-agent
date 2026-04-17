import { Decimal } from "@prisma/client/runtime/client";
import { ActionItemPriority, AIResponseTone, BillingInterval } from "../../generated/prisma";

export interface NewCreatedUserWithAccount {
    id:string;
    name:string;
    email:string;
    phone:string|null;
    createdAt:Date;
}
export interface UserCreateDataset {
    name:string;
    email:string;
    password:string;
    phone?:string|null;
    emailAccounts:{
        create:{
            emailAddress:string;
        }
    }
}
export interface UserProfileData {    
    id: string;
    email: string;
    name: string;
    phone: string | null;
    isActive: boolean;
    isAutomationActive:boolean;
    aiResponseTone:AIResponseTone;
    aiServiceName:string;
    lastAutomationRanAt:Date | null;
    createdAt: Date;   
}
export interface EmailAccountData {
    id: string;
    userId: string;
    emailAddress: string;
    appPassword: string | null;
    authId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    smtpHost: string | null;
    smtpPort: number | null;
    imapHost: string | null;
    imapPort: number | null;
    provider: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
export interface UserData {
    id: string;
    email: string;
    name: string;
    phone: string | null;
}
export interface UserDataByEmail {
    id:string;
    name:string;
    email:string;
}
export interface IssuedPassResetTokenData {
    rawToken:string;
    otherData:PassResetTokenData;
}
export interface PassResetTokenData {
    id:string;
    userId:string;
    token:string;
    expiresAt:Date;
}
export interface SubscriptionPlanData {
    id:string;
    name:string;
    quota:number;
    price:Decimal;
    gatewayPlanId:string|null;
    billingInterval:BillingInterval;
    gatewayCustomerNotify:number | null;
    gatewayTotalCount:number | null;
}
export interface ActiveSubscriptionPlanData {
    user: {
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        email: string;
        phone: string | null;
        isAutomationActive: boolean;
        aiResponseTone: AIResponseTone;
        lastAutomationRanAt: Date | null;
    };
    id: string;
    userId: string;
    planId: string;
    currentUsageCount: number;
    startDate: Date;
    endDate: Date;
    gatewaySubscriptionId:string | null;
    plan: {
        id: string;
        name: string;
        quota: number;
        price: Decimal;
        gatewayPlanId:string | null;
        billingInterval:BillingInterval;
        gatewayTotalCount:number | null;
        gatewayCustomerNotify:number | null;
    };
}
export interface SubscriptionCreationDataset {    
    userId:string;
    planId:string;
    gatewaySubscriptionId:string | null;
    currentUsageCount:number;
    startDate:Date;
    endDate:Date;
    isActive:boolean;    
}

export interface NewSubscriptionDataset {
    id: string;
    createdAt: Date;
    gatewaySubscriptionId: string | null;
    currentUsageCount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    userId: string;
    planId: string;
}

export interface FetchAIToneDatasetEach {
    id:string;
    label:string;
    value:string;
    isActive:boolean;
}

export interface FetchAIServiceDatasetEach {
    id:string;    
    value:string;
    isActive:boolean;
}
export interface GenerateStatsResponse {
    label:string;
    iconKey:string;
    value:number;
}
export interface FetchActionItemsDataFormat {
    label: string;
    priority: ActionItemPriority
    deadline: Date | null;
    dateCreated: Date;
    isSeen: boolean;
    id:string;
}
export interface FetchEmailActivityResponse {
    id: string;
    messageSender: string | null;
    messageSubject: string | null;
    messageDate: Date | null;
    action: string;
    reason: string | null;
    processedAt: Date;
}