import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { CreateEventInput } from './types';
import { logger } from '../../../config/logger';

// Maps common UTC offsets to IANA timezone names.
// When an offset maps to multiple zones (e.g. -0500 is both EST and CDT),
// we pick the most populated/representative one.
function offsetToIANA(offset: string): string {
    const map: Record<string, string> = {
        '-1200': 'Etc/GMT+12',
        '-1100': 'Pacific/Midway',
        '-1000': 'Pacific/Honolulu',
        '-0900': 'America/Anchorage',
        '-0800': 'America/Los_Angeles',
        '-0700': 'America/Denver',
        '-0600': 'America/Chicago',
        '-0500': 'America/New_York',
        '-0400': 'America/Halifax',
        '-0300': 'America/Sao_Paulo',
        '-0200': 'America/Noronha',
        '-0100': 'Atlantic/Azores',
        '+0000': 'UTC',
        '+0100': 'Europe/London',
        '+0200': 'Europe/Paris',
        '+0300': 'Europe/Moscow',
        '+0330': 'Asia/Tehran',
        '+0400': 'Asia/Dubai',
        '+0430': 'Asia/Kabul',
        '+0500': 'Asia/Karachi',
        '+0530': 'Asia/Kolkata',
        '+0545': 'Asia/Kathmandu',
        '+0600': 'Asia/Dhaka',
        '+0630': 'Asia/Yangon',
        '+0700': 'Asia/Bangkok',
        '+0800': 'Asia/Shanghai',
        '+0845': 'Australia/Eucla',
        '+0900': 'Asia/Tokyo',
        '+0930': 'Australia/Darwin',
        '+1000': 'Australia/Sydney',
        '+1100': 'Pacific/Noumea',
        '+1200': 'Pacific/Auckland',
        '+1300': 'Pacific/Apia',
    };
    return map[offset] ?? 'UTC';
}
export class CalendarService {
    async createGoogleEvent(input:CreateEventInput) {
        try{
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: input.token });
            const calendar = google.calendar({ version: 'v3', auth });

            // Determine if the datetime has a time component or is date-only.
            // AI now sends full ISO timestamps, but this guard handles both cases safely.
            const hasTime = input.startDateTime.includes('T');
            const ianaTimezone = offsetToIANA(input.senderUtcOffset);
            await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: input.title,
                    description: input.description,
                    start: hasTime
                        ? { dateTime: input.startDateTime, timeZone: ianaTimezone }
                        : { date: input.startDateTime },
                    end: hasTime
                        ? { dateTime: input.endDateTime, timeZone: ianaTimezone }
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
                    endDateTime: input.endDateTime,
                    senderUtcOffset: input.senderUtcOffset
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
            const ianaTimezone = offsetToIANA(input.senderUtcOffset);
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
                        timeZone: ianaTimezone,
                    },
                    end: {
                        dateTime: input.endDateTime,
                        timeZone: ianaTimezone,
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
                        timeZone: ianaTimezone,
                    },
                    end: {
                        dateTime: input.endDateTime.split('T')[0],
                        timeZone: ianaTimezone,
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
                    endDateTime: input.endDateTime,
                    senderUtcOffset: input.senderUtcOffset
                },
                details: err instanceof Error ? err.message : "",
                stack: err instanceof Error ? err.stack : null
            });
            return false;
        }        
    }
}