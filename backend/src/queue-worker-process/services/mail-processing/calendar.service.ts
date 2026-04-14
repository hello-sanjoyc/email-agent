import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { CreateEventInput } from './types';
import { logger } from '../../../config/logger';

export class CalendarService {
    async createGoogleEvent(input:CreateEventInput) {
        try{
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: input.token });
            const calendar = google.calendar({ version: 'v3', auth });

            await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: input.title,
                    description: input.description,
                    start: { date: input.startDateTime.split('T')[0]},
                    end: { date: input.endDateTime},
                    reminders:{
                        useDefault:false,
                        overrides:[{method:"popup",minutes:15}]
                    }
                },
            });
            return true;
        }catch(err){
            logger.error('[EMAIL PROCESSING]',{
                message:"error during create calendar event(google)",
                details:err instanceof Error?err.message:"",
                stack: err instanceof Error?err.stack:null
            });
            return false;
        }
        
    }

    async createMicrosoftEvent(input:CreateEventInput) {
        try{
            const client = Client.init({
                authProvider: (done) => done(null, input.token),
            });

            const event = {
                subject:input.title,
                body: {
                    contentType: 'HTML',
                    content: input.description,
                },
                start: {
                    dateTime: input.startDateTime,
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: input.endDateTime,
                    timeZone: 'UTC',
                },
            };

            return await client.api('/me/events').post(event);
        }catch(err){
            logger.error('[EMAIL PROCESSING]',{
                message:"error during create calendar event(microsoft)",
                details:err instanceof Error?err.message:"",
                stack: err instanceof Error?err.stack:null
            });
            return false;
        }        
    }
}