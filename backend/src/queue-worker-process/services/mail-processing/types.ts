import { ImapSimpleOptions } from "imap-simple";
import * as imaps from "imap-simple";
import { ActionItemPriority } from "../../../generated/prisma";

export interface MicrosoftGetMessageResponse {
     "@odata.context": string;
    value: [
        {
            "@odata.etag": string;
            id: string;
            internetMessageId:string;
            subject:string;
            toRecipients:{emailAddress:{name:string;address:string;}}[];
            receivedDateTime:string;
            body:{
                content:string;
            };
            bodyPreview:string;
            sender: {
                emailAddress: {
                    name: string;
                    address: string;
                }
            }
        }
    ]
}
export interface FormatAddressInput {
    emailAddress:{
        name:string;
        address:string;
    }
}
export interface ReadImapMessagesInput {
    subject_email:string;
    subject_password:string;
    authString:string;
    subject_imap_url:string;
    subject_imap_port:number;
    subscription_date:Date;
    readCount:number;
    provider:Provider;
}
export enum Provider {
    GOOGLE = 'google',
    CUSTOM = 'custom',
    MICROSOFT = 'microsoft'
}
export type ImapConfigWithOauth = Omit<ImapSimpleOptions,'imap'> & {
    imap:Omit<ImapSimpleOptions['imap'],'password'> & {xoauth2:string}
}
export interface ImapCreateReplyInput {
    subject_email:string;    
    messageID:string;   
    reply_receiver_email:string;
    reply_subject:string;
    reply_text:string;
    liveImapConnection:imaps.ImapSimple;
}
export interface MsForwardInput {
    token:string;
    messageID:string;
    receiverMailArray:string[];
    forwardText:string;
}
export interface SmtpForwardInput {
    provider:string;
    token:string;
    email:string;
    password:string; 
    smtpHost:string;
    smtpPort:number;   
    original:{
        to:string;
        from:string;
        subject:string;
        date:string;
        forward_text:string;
        shortened_body:string;
        forward_html:string;
        attachments:any[];
    },
    forward:{
        to:string[];
        from:string;
        text:string;
    }
}

export interface MarkAsReadInput{
    provider:string;    
    messageID:string;
    token:string;
    liveImapConnection:imaps.ImapSimple | null;
}
export interface CreateEventInput {
    token:string;
    title:string;
    startDateTime:string;
    endDateTime:string;
    description:string;
}
export interface ReadMessageResponse{
    messageID:string;
    from:string;
    to:string;
    subject:string;
    date:string;
    shortened_body:string;
    forward_html:string;
    forward_text:string;
    internetMessageId:string;
    attachments: any;
}
export interface ImapReadMessageResponse {
    readMessageResponse:ReadMessageResponse[],
    liveImapConnection:imaps.ImapSimple
}

//ai service related interfaces
export interface EmailClassificationDetails {
    meeting_start_datetime: string;
    meeting_end_datetime: string;
    meeting_title: string;
    meeting_link: string;
    meeting_description: string;
    follow_up_title: string;
    follow_up_description: string;
    follow_up_start_datetime: string;
    follow_up_end_datetime: string;
    reply_sender_email: string;
    reply_receiver_email: string;
    reply_subject: string;
    reply_text: string;
    forward_sender_email: string;
    forward_receiver_email: string[];
    forward_subject: string;
    forward_text: string;
}

export type EmailAction = 
    'forward'
    | 'no_action' 
    | 'reply' 
    | 'schedule_meeting' 
    | 'follow_up' 
    | 'forward' 
    | 'other';

export interface EmailClassificationOutput {     
    action: EmailAction;
    reason: string;
    meeting_start_datetime: string;
    meeting_end_datetime: string;
    meeting_title: string;
    meeting_link: string;
    meeting_description: string;
    follow_up_title: string;
    follow_up_description: string;
    follow_up_start_datetime: string;
    follow_up_end_datetime: string;    
    reply_subject: string;
    reply_text: string;    
    forward_receiver_email: string[];   
    forward_text: string;
    action_items: ActionItem[];    
}
export interface ActionItem {
    summary: string;
    deadline: string | null;  // ISO string from AI; converted to Date only at DB insert time
    priority: ActionItemPriority;
}
export interface ActionResultBagItem {
    isCompleted:boolean;
    messageID:string;
    action:string;
    reason:string;
    actionItems: ActionItem[];
}
export interface ProcessEmailResponse {
    error:boolean;
    message:string;
    data:ActionResultBagItem[];
    errorObj?:Error | null;
}