import { AuthService } from "./auth.service";
import { CalendarService } from "./calendar.service";
import { EmailService } from "./email.service";
import { EmailProcessingPayload } from "../../../types/types";
import { ActionResultBagItem, CreateEventInput , ImapCreateReplyInput, MarkAsReadInput, MsForwardInput, ProcessEmailResponse, Provider, ReadMessageResponse, SmtpForwardInput } from "./types";
import * as imaps from 'imap-simple';
import { AIServiceFactory } from "./ai/ai.factory";
const auth = new AuthService();
const calendar = new CalendarService();
const email = new EmailService();
const isProvider = (value:string) => {
    return Object.values(Provider).includes(value as Provider)
}
export const processEmail = async (payload:EmailProcessingPayload):Promise<ProcessEmailResponse> => {
    let subjectImapConnection:imaps.ImapSimple | null = null;
    try{
        const { n8n_payload, general_data } = payload;
        //ai instance setup based on the user's provider selection
        const ai = AIServiceFactory.getProvider(general_data.ai_service_name);
        //provider type safety check
        if(!isProvider(n8n_payload.subject_provider)){
            return {
                error:true,
                message:"Invalid subject provider",
                data:[]
            }
        }
        //generate access token for email and calendar accounts
        let emailAccountAccessToken:string;
        let calendarAccountAccessToken:string;
        let googlexoauth:string="";        
        //get the subject access token when provider is microsoft or google(for google, set the xoauth too),empty if provider is anything else
        if(n8n_payload.subject_provider === "microsoft"){
            emailAccountAccessToken = await auth.refreshMicrosoftToken(n8n_payload.subject_refresh_token);
        }else if(payload.n8n_payload.subject_provider === "google"){
            emailAccountAccessToken = await auth.refreshGoogleToken(n8n_payload.subject_refresh_token);
            googlexoauth = auth.buildXOAUTH2String(emailAccountAccessToken,n8n_payload.subject_email);
        }else{
           emailAccountAccessToken = "";
        }  
        //get the calendar access token when provider is microsoft or google
        if(n8n_payload.calendar_provider === "microsoft"){
            calendarAccountAccessToken = await auth.refreshMicrosoftToken(n8n_payload.calendar_refresh_token);
        }else if(payload.n8n_payload.calendar_provider === "google"){
            calendarAccountAccessToken = await auth.refreshGoogleToken(n8n_payload.calendar_refresh_token);           
        }else{
            return {
                error:true,
                message:"Invalid calendar email provider",
                data:[]
            }
        }
        //after all the authentication params creation, we will stop if:
        // calendar access token is missing.
        // for microsoft or google subject providers, email account access token is missing
        // for google subject provider, googlexoauth string is missing
        if(!calendarAccountAccessToken
            || (["microsoft","google"].includes(n8n_payload.subject_provider) && !emailAccountAccessToken)
            || (n8n_payload.subject_provider === 'google' && !googlexoauth)){
            return {
                error:false,
                message:"Invalid authentication",
                data:[]
            }
        }
        //read the inbox
        let messages:ReadMessageResponse[];
        if(n8n_payload.subject_provider === 'microsoft'){
            messages = await email.readMicrosoftMessages(emailAccountAccessToken,n8n_payload.process_quantity);
        }else{
            //create the payload
            const payload = {
                 subject_email:n8n_payload.subject_email,
                subject_password:n8n_payload.subject_password,
                authString:googlexoauth,
                subject_imap_url:n8n_payload.subject_imap_url,
                subject_imap_port:n8n_payload.subject_imap_port,
                subscription_date:n8n_payload.subscription_date,
                readCount:n8n_payload.process_quantity,
                provider:n8n_payload.subject_provider as Provider
            };
            //get the messages along with a live imap connection instance
            const {readMessageResponse,liveImapConnection} = await email.readImapMessages(payload);
            //set imap connection to a top level veriable of this whole function so that we can use it somewhere else
            subjectImapConnection = liveImapConnection
            messages = readMessageResponse;
        }
        //decide action and then act based on that action
        let actionResultBag:ActionResultBagItem[]=[];
        let actionResult:ActionResultBagItem;
        for(let msg of messages){
            //generate user prompt
            const userPrompt = ai.generateUserPrompt(msg.subject,msg.date,msg.shortened_body);
            //ask ai to generate an object indicating what action to take
            const actionObject = await ai.classifyEmail(userPrompt);
            switch(actionObject.action){
                case "schedule_meeting":
                    //creating meeting event payload, same for google and microsoft
                    const meetingPayload:CreateEventInput = {
                        token:calendarAccountAccessToken,
                        title:actionObject.meeting_title,
                        description:actionObject.meeting_description,
                        startDateTime:actionObject.meeting_start_datetime,
                        endDateTime:actionObject.meeting_end_datetime    
                    }
                    //response variable
                    let secheduleMeetingResponse:boolean;
                    if(n8n_payload.calendar_provider === 'google'){  
                        //set google calendar event                     
                        secheduleMeetingResponse = await calendar.createGoogleEvent(meetingPayload);
                    }else{
                        //set microsoft calendar event
                        secheduleMeetingResponse = await calendar.createMicrosoftEvent(meetingPayload);
                    }
                    //based on response, set the action result of the message                                        
                    if(secheduleMeetingResponse === true){
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:true,
                            actionItems:actionObject.action_items ?? []
                        };
                    }else{
                         actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:false,
                            actionItems:actionObject.action_items ?? []
                        };
                    }
                    break;
                case "follow_up":
                    //set followup payload, same for google or microsoft
                    const followUpPayload:CreateEventInput = {
                        token:calendarAccountAccessToken,
                        title:actionObject.follow_up_title,
                        description:actionObject.follow_up_description,
                        startDateTime:actionObject.follow_up_start_datetime,
                        endDateTime:actionObject.follow_up_end_datetime    
                    }
                    //set response variable
                    let scheduleFollowUpResponse:boolean;
                    if(n8n_payload.calendar_provider === 'google'){                       
                        //set the google calendar event
                        scheduleFollowUpResponse = await calendar.createGoogleEvent(followUpPayload);
                    }else{
                        //set the microsoft calendar event
                        scheduleFollowUpResponse = await calendar.createMicrosoftEvent(followUpPayload);
                    }
                    //based on response, set the action result of the message                                        
                    if(scheduleFollowUpResponse === true){
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:true,
                            actionItems:actionObject.action_items ?? []
                        };
                    }else{
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:false,
                            actionItems:actionObject.action_items ?? []
                        };
                    }
                    break;
                case "reply":
                    //set the response variable
                    let replyResponse:boolean;
                    if(n8n_payload.subject_provider === 'microsoft'){
                        //set draft reply
                        replyResponse = await email.msCreateReply(emailAccountAccessToken,msg.messageID,actionObject.reply_text);
                    }else{
                        //Imap connection check, if okay, only then proceed forward
                        if(!subjectImapConnection){
                            replyResponse = false;
                        }else{
                            //payload setup for imap draft reply saving
                            const payload:ImapCreateReplyInput = {
                                subject_email:msg.to,                           
                                messageID:msg.messageID,                            
                                reply_receiver_email:msg.from,
                                reply_subject:actionObject.reply_subject,
                                reply_text:actionObject.reply_text,
                                liveImapConnection:subjectImapConnection
                            }
                            //set draft reply
                            replyResponse = await email.imapCreateReply(payload);
                        }                      
                    }
                    //based on response, set the action result of the message
                    if(replyResponse === true){
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:true,
                            actionItems:actionObject.action_items ?? []
                        };
                    }else{
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:false,
                            actionItems:actionObject.action_items ?? []
                        };
                    }
                    break;
                case "forward":
                    //set the response variable
                    let forwardResponse:boolean;
                    if(n8n_payload.subject_provider === 'microsoft'){
                        //create the microsoft payload
                        const payload:MsForwardInput = {
                            token:emailAccountAccessToken,
                            messageID:msg.messageID,
                            receiverMailArray:actionObject.forward_receiver_email,
                            forwardText:actionObject.forward_text
                        }
                        //message forwarding function call
                        forwardResponse = await email.msForward(payload);
                    }else{
                        //create smtp payload
                        const payload:SmtpForwardInput = {
                            provider:n8n_payload.subject_provider,
                            token:emailAccountAccessToken,
                            email:n8n_payload.subject_email,
                            password:n8n_payload.subject_password,
                            smtpHost:n8n_payload.subject_smtp_url,
                            smtpPort:n8n_payload.subject_smtp_port,
                            original:{
                                to:msg.to,
                                from:msg.from,
                                subject:msg.subject,
                                date:msg.date,
                                forward_text:msg.forward_text,
                                shortened_body:msg.shortened_body,
                                forward_html:msg.forward_html,
                                attachments:msg.attachments
                            },
                            forward:{
                                to:actionObject.forward_receiver_email,
                                from:msg.to,
                                text:actionObject.forward_text
                            }
                        }
                        //forwarding using smtp connection
                        forwardResponse = await email.smtpForward(payload); 
                    }
                    //based on response, set the action result of the message
                    if(forwardResponse === true){
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:true,
                            actionItems:actionObject.action_items ?? []
                        };
                    }else{
                        actionResult ={
                            action:actionObject.action,
                            messageID:msg.messageID,
                            reason:actionObject.reason,
                            isCompleted:false,
                            actionItems:actionObject.action_items ?? []
                        };
                    }
                    break;
                case "no_action":
                    //set the action result of the message
                    actionResult ={
                        action:actionObject.action,
                        messageID:msg.messageID,
                        reason:actionObject.reason,
                        isCompleted:true,
                        actionItems:actionObject.action_items ?? []
                    };
                    break;
                case "other":
                    //set the action result of the message
                    actionResult ={
                        action:actionObject.action,
                        messageID:msg.messageID,
                        reason:actionObject.reason,
                        isCompleted:true,
                        actionItems:actionObject.action_items ?? []
                    };
                    break;
                default:
                    actionResult = {
                        action:actionObject.action,
                        messageID:msg.messageID,
                        reason:actionObject.reason,
                        isCompleted:true,
                        actionItems:actionObject.action_items ?? []
                    }                    
            }
            //mark the message as read if the action that was decided for that message is successfully completed
            if(actionResult.isCompleted === true){
                const payload:MarkAsReadInput = {
                    provider:n8n_payload.subject_provider,    
                    messageID:msg.messageID,
                    token:emailAccountAccessToken,
                    liveImapConnection:subjectImapConnection
                }
                await email.markAsRead(payload);
            }
            //push action result of a message in the action bag
            actionResultBag.push(actionResult);
        }
        //send response
        return {
            error:false,
            message:"email processed",
            data:actionResultBag
        }      
    }catch(err){
        return {
            error:true,
            message:"Internal server error: "+(err instanceof Error?err.message:'unknown'),
            errorObj: err instanceof Error? err:null,
            data:[]
        }
    }finally{
        if(subjectImapConnection){
            subjectImapConnection.end();
        }
    }
}