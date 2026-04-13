import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer';
import axios from 'axios';
import { FormatAddressInput, ImapConfigWithOauth, ImapCreateReplyInput, ImapReadMessageResponse, MarkAsReadInput, MicrosoftGetMessageResponse, MsForwardInput, ReadImapMessagesInput, ReadMessageResponse, SmtpForwardInput } from './types';
import {v4 as uuidv4} from 'uuid';

export class EmailService {
    private formatImapDate(date:Date | string):string{
        const months= [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const d = date instanceof Date ? date: new Date(date);
        const day = String(d.getDate()).padStart(2,'0');
        const month = months[d.getMonth()];
        const year = String(d.getFullYear());
        return `${day}-${month}-${year}`;
    }    
    private formatAddress (addrObj:FormatAddressInput){
        if (!addrObj || !addrObj.emailAddress) return "";
        const name = addrObj.emailAddress.name || "";
        const address = addrObj.emailAddress.address || "";
        return name ? `${name} <${address}>` : address;
    };
    private cleanEmailBody(html: string): string {
        let text = convert(html || "", {
            wordwrap: false,
            selectors: [
                { selector: "a", options: { ignoreHref: true } },
                { selector: "img", format: "skip" },
                { selector: "style", format: "skip" },
            ],
        });

        return text
            .replace(/\s+/g, " ")
            .replace(/\u00a0/g, " ")
            .trim();
    }    
    private findDraftsFolder(boxes: any, parent = ''): string | null {
        for (const name in boxes) {
            const box = boxes[name];
            const fullName = parent ? `${parent}${box.delimiter}${name}` : name;
            if (/drafts/i.test(name) || (box.attribs && box.attribs.some((attr: string) => /draft/i.test(attr)))) {
                return fullName;
            }
            if (box.children) {
                const found = this.findDraftsFolder(box.children, fullName);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * INBOX READING: MICROSOFT (GRAPH API)
     */
    async readMicrosoftMessages(token: string,readCount:number):Promise<ReadMessageResponse[]> {
        const response = await axios.get<MicrosoftGetMessageResponse>('https://graph.microsoft.com/v1.0/me/messages', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                '$filter': 'isRead eq false',
                '$top': readCount, // Matching your messages.slice(0, 5)
                '$select': 'id,subject,from,toRecipients,receivedDateTime,body,bodyPreview'
            }
        });
        
        return response.data.value.map((msg) =>{
            const toStr = (msg.toRecipients || [])
            .map(recipient => this.formatAddress(recipient))
            .join(', ');
            const plainText = msg.body.content
            .replace(/<[^>]*>?/gm, ' ') // Strip HTML tags
            .replace(/\s+/g, ' ')       // Remove extra whitespace
            .trim();
            return {
                messageID: msg.id,
                from: msg.sender.emailAddress.address,
                to:toStr,
                subject: msg.subject,
                date: msg.receivedDateTime,
                shortened_body: plainText.substring(0,500),
                forward_html: msg.body.content,
                forward_text: plainText,
                internetMessageId:msg.internetMessageId,
                attachments: [] // Graph attachments require a separate call
            };   
        });
    }

    /**
     * INBOX READING: GOOGLE & CUSTOM (IMAP)
     */
    async readImapMessages(input:ReadImapMessagesInput):Promise<ImapReadMessageResponse> {
        let config:imaps.ImapSimpleOptions | ImapConfigWithOauth;
        if(input.provider === 'google'){
            config = {
                imap: {
                    user: input.subject_email,                    
                    xoauth2: input.authString,
                    host: input.subject_imap_url,
                    port: input.subject_imap_port,
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },
                    authTimeout: 10000
                }
            };
        }else{
            config = {
                imap: {
                    user: input.subject_email,
                    password: input.subject_password,                    
                    host: input.subject_imap_url,
                    port: input.subject_imap_port,
                    tls: true,
                    tlsOptions: { rejectUnauthorized: false },
                    authTimeout: 10000
                }
            };
        }
        const connection = await imaps.connect(config as imaps.ImapSimpleOptions);
        await connection.openBox('INBOX');

        let sinceDate = this.formatImapDate(input.subscription_date);
        const searchCriteria = ['UNSEEN', ['SINCE', sinceDate]];
        const fetchOptions = {
            bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)", ""],
            struct: true,
            markSeen: false
        };

        const messages = (await connection.search(searchCriteria, fetchOptions)).reverse();
        const messagesArray = await Promise.all(messages.slice(0, input.readCount).map(async (msg) => {
            const headerPart = msg.parts.find(p => p.which.includes('HEADER'));
            const textPart = msg.parts.find(p => p.which === '');
            const header = headerPart?.body || {};
            const parsed = await simpleParser(textPart?.body || '');

            return {
                messageID: header['message-id'] || '',
                from: header.from || '',
                to: header.to || '',
                subject: header.subject || '',
                date: header.date || '',
                shortened_body: parsed.text ? parsed.text.trim().substring(0, 500) : this.cleanEmailBody(parsed.html || '').substring(0, 500),
                forward_text: parsed.text || '',
                forward_html: parsed.html || '',
                internetMessageId:"",
                attachments: (parsed.attachments || []).map(att => ({
                    filename: att.filename,
                    content: att.content,
                    contentType: att.contentType,
                    cid: att.cid
                }))
            };
        }));        
        return{
            readMessageResponse:messagesArray,
            liveImapConnection:connection
        };
    }

    /**
     * ACTION: REPLY DRAFT (MICROSOFT)
     */
    async msCreateReply(token: string, messageId: string, text: string) {
        try{
            const url = `https://graph.microsoft.com/v1.0/me/messages/${messageId}/createReply`;
            const headers = {Authorization: `Bearer ${token}`}
            const res = await axios.post(
                url,
                {comment:text},
                {headers}
            );
            const draftID = res.data.id;
            const verify = await axios.get(
                `https://graph.microsoft.com/v1.0/me/messages/${draftID}`,
                { headers }
            );

            return draftID === verify.data.id;
        }catch(err){
            return false;
        }        
    }

    /**
     * ACTION: REPLY DRAFT (IMAP)
     */
    async imapCreateReply(input:ImapCreateReplyInput) {
        try{
            const draftMessageID = `<${uuidv4()}@${input.subject_email.split('@')[1]}>`
            const mail = new MailComposer({
                from: input.subject_email,
                to: input.reply_receiver_email,
                subject: input.reply_subject,
                text: input.reply_text,
                inReplyTo: input.messageID,
                references: input.messageID,
                messageId:draftMessageID
            });
            const mime = await mail.compile().build();        
            const boxes = await input.liveImapConnection.getBoxes();
            const draftBox = this.findDraftsFolder(boxes) || 'Drafts';

            await input.liveImapConnection.openBox(draftBox);
            await input.liveImapConnection.append(mime, { mailbox: draftBox, flags: ['\\Draft'] });
            await input.liveImapConnection.closeBox(false);
            await input.liveImapConnection.openBox(draftBox); 
            // Search for the draft to confirm it exists
            const results = await input.liveImapConnection.search(
                [['HEADER', 'Message-ID', draftMessageID]],
                { bodies: [], markSeen: false }
            );      
            return results.length > 0;
        }catch(err){
            return false;
        }
       
    }

    /**
     * ACTION: FORWARD (MICROSOFT)
     */
    async msForward(input:MsForwardInput) {
        try{
            const toRecipients = input.receiverMailArray.map((each)=>{
                return {
                    emailAddress:{address:each}
                }
            });
            const url = `https://graph.microsoft.com/v1.0/me/messages/${input.messageID}/forward`;
            const res = await axios.post(url, {
                toRecipients,
                comment: input.forwardText
            }, { headers: { Authorization: `Bearer ${input.token}` } });
            return res.status === 202;
        }catch(err){
            return false
        }        
    }

    /**
     * ACTION: FORWARD (SMTP)
     */
    async smtpForward(input:SmtpForwardInput):Promise<boolean> {
        try{
            const transporter = nodemailer.createTransport({
                host: input.smtpHost,
                port: input.smtpPort,
                secure: true,
                auth: (input.provider === 'google') 
                    ? { type: 'OAuth2', user: input.email, accessToken: input.token }
                    : { user: input.email, pass: input.password }
            });

            const header = `<br>---------- Forwarded message ---------<br><b>From:</b> ${input.original.from}<br><b>Date:</b> ${input.original.date}<br><b>Subject:</b> ${input.original.subject}<br><b>To:</b> ${input.original.to}<br><br>`;

            await transporter.sendMail({
                from: input.forward.from,
                to: input.forward.to,
                subject: "Fwd: " + input.original.subject,
                text: input.forward.text + "\n" + (input.original.forward_text || input.original.shortened_body),
                html: input.forward.text + header + (input.original.forward_html || input.original.forward_text),
                attachments: input.original.attachments || []
            });
            return true;
        }catch(err){
            return false;
        }        
    }

    /**
     * OPERATION: MARK AS READ
     */
    async markAsRead(input:MarkAsReadInput,) {
        try{
            if (input.provider === 'microsoft') {
                await axios.patch(`https://graph.microsoft.com/v1.0/me/messages/${input.messageID}`, { isRead: true }, {
                    headers: { Authorization: `Bearer ${input.token}` }
                });
            } else {
                if(input.liveImapConnection){
                    await input.liveImapConnection.openBox('INBOX');
                    const searchCriteria = [['HEADER', 'MESSAGE-ID', input.messageID]];
                    const messages = await input.liveImapConnection.search(searchCriteria, { bodies: ['HEADER'], struct: true });
                    if (messages.length > 0) {
                        const uids = messages.map((each)=>each.attributes.uid);
                        await input.liveImapConnection.addFlags(uids, '\\Seen');
                    } 
                }else{
                    return false;
                }                           
            }
            return true;
        }catch(err){
            return false;
        }        
    }
}