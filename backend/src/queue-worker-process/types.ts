
export interface EmailSendQueuePayload {
  subject:string;
  to:string;
  content:string;
}

export interface N8NResponseFormat {
  messageID:string;
  action:string;
  reason:string;
}
export interface EmailActivityCreationDataset{
  userId:string;
  emailAccountId:string;
  calendarAccountId:string;
  planId:string | null;
  subscriptionId:string | null;
  messageId:string;
  messageSender:string | null;
  messageSubject:string | null;
  messageDate: Date | null;
  action:string;
  reason:string | null;
  isCompleted:boolean;
  processedAt:Date;
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