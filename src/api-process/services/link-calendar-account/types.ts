import { LinkCalendarAccountInput } from "../../controllers/v1/types";

export interface LinkCalendarAccountResponse {
    accessToken:string|null;
    refreshToken:string|null;
    email:string;    
    provider:string;
}
export interface CalendarAccountLinkProvider {
    link(payload:LinkCalendarAccountInput):Promise<LinkCalendarAccountResponse>;
}
