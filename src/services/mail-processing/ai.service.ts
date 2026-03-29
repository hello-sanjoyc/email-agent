import Groq from 'groq-sdk'
import env from '../../config/env'
import { EmailClassificationOutput } from './types';
export class AIService{
    private client = new Groq({apiKey:env.GROQ_API_KEY});
    private systemPrompt = `You are an email classifier. Analyze the email below and return a single JSON object. No extra text, no markdown, no comments — strictly valid JSON only.

ACTIONS:
- no_action: informational, promotional, transactional, newsletters, OTPs, receipts — no response needed.
- reply: email expects a response, confirmation, or input. Also use when forward is requested but no target email is given (draft only).
- schedule_meeting: email contains a meeting invite, conference link, or request to meet/join a call. Create all-day event (timezone unknown).
- follow_up: email explicitly asks to follow up on something. Create all-day reminder event.
- forward: ONLY if email instructs forwarding AND contains specific target email address(es). If no target email found, treat as reply.
- other: anything that doesn't fit above and needs no automation. Same as no_action.

DATETIME RULES:
- All datetimes in UTC, time always 00:00:00 (all-day events).
- End datetime = start datetime + 1 day.
- If date is relative (e.g. "this sunday", "next monday", "tomorrow"), resolve it against the email's received date.
- If no date found, use the email's received date.
- schedule_meeting and follow_up: start/end datetimes must never be empty.
- All other actions: leave datetime fields as empty strings.

FIELD MAPPING:
- reply: reply_subject, reply_text
- forward: forward_receiver_email, forward_text
- schedule_meeting: meeting_start_datetime, meeting_end_datetime, meeting_title, meeting_link, meeting_description
- follow_up: follow_up_title, follow_up_description, follow_up_start_datetime, follow_up_end_datetime
- no_action/other: no detail fields needed

OUTPUT SCHEMA:
{
  "action": "",
  "reason": "",
  "meeting_start_datetime": "",
  "meeting_end_datetime": "",
  "meeting_title": "",
  "meeting_link": "",
  "meeting_description": "",
  "follow_up_title": "",
  "follow_up_description": "",
  "follow_up_start_datetime": "",
  "follow_up_end_datetime": "",  
  "reply_subject": "",
  "reply_text": "", 
  "forward_receiver_email": [], 
  "forward_text": ""
}

Populate action and reason always. Populate only the fields mapped to the chosen action. Leave all other detail fields as empty strings. forward_receiver_email is always an array. Include every key.`;
    generateUserPrompt(subject:string,date:string,bodySummary:string){
        return `Date: ${date}
        Subject: ${subject}
        Body: ${bodySummary}`
    }
    async classifyEmail(userPrompt:string):Promise<EmailClassificationOutput>{
        const response = await this.client.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {
                    role:"system",
                    content:this.systemPrompt
                },
                {
                    role:"user",
                    content:userPrompt
                }
            ],
            response_format:{type:"json_object"}
        });
        return JSON.parse(response.choices[0].message.content || "{}") as EmailClassificationOutput;
    }
}