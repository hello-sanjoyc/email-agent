
export interface EmailProcessingPayload {
  n8n_payload:N8NPayload;
  general_data:GeneralData
  
}
export interface GeneralData {
  user_id:string;
  plan_id:string;
  subscription_id:string;
  email_account_id:string;
  calendar_account_id:string;
  ai_response_tone:string;
  ai_service_name:string;
}
export interface N8NPayload {
  process_quantity:number;
  calendar_mail:string;
  calendar_refresh_token:string;
  calendar_provider:string; 
  subscription_date:Date;
  google_project_client_id:string;
  google_project_client_secret:string;
  microsoft_project_client_id:string;
  microsoft_project_client_secret:string;
  microsoft_project_object_id:string;
  subject_email:string;
  subject_provider:string;
  subject_password:string;
  subject_refresh_token:string;
  subject_imap_url:string;
  subject_imap_port:number;
  subject_smtp_url:string;
  subject_smtp_port:number;
}

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