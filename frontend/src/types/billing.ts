export interface SubscriptionPlanData {
    id:string;
    name:string;
    quota:number;
    price:string;
    billingInterval: 'MONTH' | 'YEAR' | 'TRIAL'; // Crucial for UI
    gatewayTotalCount:number;
    maxEmailsPerRun:number;
}
export interface UserData {
    id: string;
    name: string;
    createdAt: string;
    isActive: boolean;
    email: string;
    phone: string | null;
    isAutomationActive: boolean;
    aiResponseTone: AIResponseTone;
    lastAutomationRanAt: string | null;
}
export interface ActiveSubscriptionPlanData {
    user: UserData;
    id: string;
    userId: string;
    planId: string;
    currentUsageCount: number;
    startDate: Date;
    endDate: Date;
    plan: SubscriptionPlanData;
}
export const AIResponseTone = {
    CASUAL: "CASUAL",
    PROFESSIONAL: "PROFESSIONAL"
} as const;
export type AIResponseTone = typeof AIResponseTone[keyof typeof AIResponseTone]

export interface ApiResponse<T>{
    error:boolean;
    message:string;
    data:T;
}
// Update the create response structure
export interface CreateSubscriptionResponse {
    gatewaySubscriptionId: string;
    internalSubscriptionId: string;
}
export interface RazorpayResponse {
    razorpay_payment_id:string;
    razorpay_subscription_id:string;
    razorpay_signature:string;
}
export interface RazorpayModalOptions {
    key:string;
    subscription_id:string;
    name:string;
    description:string;
    prefill:{
        name?:string;
        email?:string;
        contact?:string;
    };
    theme:{
        color:string;
    };
    modal?:{
        onDismiss?:()=>void
    }
    handler:(razorPayResponse:RazorpayResponse) => Promise<void> | void;
}
declare global {
  interface Window {
    Razorpay: new (options: RazorpayModalOptions) => {
      open: () => void;
    };
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
    lastAutomationRanAt:string | null;
    createdAt: string;   
}