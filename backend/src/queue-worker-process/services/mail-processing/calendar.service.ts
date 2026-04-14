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

            // Determine if the datetime has a time component or is date-only.
            // AI now sends full ISO timestamps, but this guard handles both cases safely.
            const hasTime = input.startDateTime.includes('T');

            await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: input.title,
                    description: input.description,
                    start: hasTime
                        ? { dateTime: input.startDateTime, timeZone: 'UTC' }
                        : { date: input.startDateTime },
                    end: hasTime
                        ? { dateTime: input.endDateTime, timeZone: 'UTC' }
                        : { date: input.endDateTime.split('T')[0] },
                    reminders: {
                        useDefault: false,
                        overrides: [{ method: 'popup', minutes: 15 }]
                    }
                }
            });
            return true;
        }catch(err){
            logger.error('[EMAIL PROCESSING]', {
                message: "error during create calendar event(google)",
                data: {
                    title: input.title,
                    startDateTime: input.startDateTime,
                    endDateTime: input.endDateTime
                },
                details: err instanceof Error ? err.message : "",
                stack: err instanceof Error ? err.stack : null
            });
            return false;
        }
        
    }

    async createMicrosoftEvent(input:CreateEventInput) {
        try{
           const client = Client.init({
                authProvider: (done) => done(null, input.token),
            });

            // Same logic as Google — check if AI returned a full timestamp or date-only
            const hasTime = input.startDateTime.includes('T');

            const event = hasTime
                ? {
                    // Timed event — use full ISO timestamps with UTC timezone
                    subject: input.title,
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
                    reminders: {
                        isReminderOn: true,
                        reminderMinutesBeforeStart: 15
                    }
                }
                : {
                    // All-day event — strip time component, set isAllDay flag
                    subject: input.title,
                    body: {
                        contentType: 'HTML',
                        content: input.description,
                    },
                    start: {
                        dateTime: input.startDateTime.split('T')[0],
                        timeZone: 'UTC',
                    },
                    end: {
                        dateTime: input.endDateTime.split('T')[0],
                        timeZone: 'UTC',
                    },
                    isAllDay: true,
                    reminders: {
                        isReminderOn: true,
                        reminderMinutesBeforeStart: 15
                    }
                };

            const result = await client.api('/me/events').post(event);
            return !!result;
        }catch(err){
            logger.error('[EMAIL PROCESSING]', {
                message: "error during create calendar event(microsoft)",
                data: {
                    title: input.title,
                    startDateTime: input.startDateTime,
                    endDateTime: input.endDateTime
                },
                details: err instanceof Error ? err.message : "",
                stack: err instanceof Error ? err.stack : null
            });
            return false;
        }        
    }
}