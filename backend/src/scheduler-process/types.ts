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
  planId:string;
  subscriptionId:string;
  messageId:string;
  action:string;
  reason:string | null;
  isCompleted:boolean;
  processedAt:Date;
}