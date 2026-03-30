import { LinkAccountInput, LinkCalendarAccountInput } from "../../../controllers/v1/types";
import AppError from "../../../utils/appError.utils";
import { CalendarAccountLinkProvider, LinkCalendarAccountResponse } from "../types";

export class MicrosoftProvider implements CalendarAccountLinkProvider{
    async link(payload: LinkCalendarAccountInput): Promise<LinkCalendarAccountResponse> {
        try{
            const base64TokenPayload = payload.id_token.split('.')[1];
            const decodedTokenPayload = JSON.parse(Buffer.from(base64TokenPayload,'base64').toString());
            const email = decodedTokenPayload.email || decodedTokenPayload.preferred_username;
            if(!email)throw new AppError("Invalid microsoft ID token: email not found",400);
            const response:LinkCalendarAccountResponse = {
                accessToken:payload.access_token,
                refreshToken:payload.refresh_token,
                email,                
                provider:"microsoft"
            } 
            return response;
        }catch(err){
            throw err;
        }
    }
}