import { AIResponseTone } from "../../../generated/prisma";

export interface LinkAccountInput {
    access_token: string;
    id_token: string;
    refresh_token: string;
    provider: string;
    email: string;
    password: string;
    imap_host: string;
    imap_port: number;
    smtp_host: string;
    smtp_port: number;
}
export interface LinkCalendarAccountInput {
    access_token: string;
    id_token: string;
    refresh_token: string;
    provider: string;
    is_new: boolean;
    account_id?:string;  
}
export interface UpdateProfileInput {
    name:string;
    email:string;
    phone:string;
}
export interface ChangeAIResponseToneInput {
    tone:AIResponseTone;
}
export interface ToggleAutomationStatus {
    status:boolean
}
export interface SendPassResetMailInput {
    email:string;
}
export interface ResetPasswordInput {
    token:string;
    userId:string;
    newPassword:string;
}
export interface LogoutInput {
    refreshToken:string;
}
export interface RefreshTokenInput {
    refreshToken:string;
}
export interface LoginInput {
    email:string;
    password:string;
}
export interface RegisterInput {
    name:string;
    email:string;
    phone?:string;
    password:string;
    retype_password:string;
}
export interface CreateSubscriptionInput {
    planId:string;
}
export interface VerifySubscriptionInput {
    razorpay_payment_id:string;
    razorpay_subscription_id:string;
    razorpay_signature:string;
    internal_subscription_id:string;
}
export enum RazorpayWebhookEvent {
    SUBSCRIPTION_CHARGED = "subscription.charged",
    SUBSCRIPTION_ACTIVATED = "subscription.activated",
    SUBSCRIPTION_HALTED = "subscription.halted",
    SUBSCRIPTION_CANCELLED = "subscription.cancelled"
}
export interface RazorpayJobPayload {
    event: RazorpayWebhookEvent;
    payload: {
        subscription: {
            entity: {
                id: string; //gateway subscription id of subscription
                status: string;
                current_start?: number;
                current_end?: number;
            }
        };
        payment?: {
            entity: {
                id: string; //payment id
                amount: number; //amount will be in paise
                currency: string;
                order_id: string;
                status: string;
            }
        };
    };
}
export interface UpdateEmailAccountsPriorityInput {
    updates:PriorityUpdate[]
};
export interface PriorityUpdate {
    id:string;
    priority:number;
}
export interface CreateEnquiryInput {
    full_name:string;
    email:string;
    phone:string;
    company:string;
    message:string;
}