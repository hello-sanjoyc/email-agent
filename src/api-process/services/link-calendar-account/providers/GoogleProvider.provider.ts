import env from "../../../../config/env";
import { LinkCalendarAccountInput } from "../../../controllers/v1/types";
import AppError from "../../../utils/appError.utils";
import { CalendarAccountLinkProvider, LinkCalendarAccountResponse } from "../types";
import { OAuth2Client } from "google-auth-library";
export class GoogleProvider implements CalendarAccountLinkProvider{
    private oAuthClient:OAuth2Client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    async link(payload: LinkCalendarAccountInput): Promise<LinkCalendarAccountResponse> {
        try{
            const ticket =await this.oAuthClient.verifyIdToken({
                idToken:payload.id_token,
                audience:env.GOOGLE_CLIENT_ID
            });
            const profile = ticket.getPayload();
            if(!profile || !profile.email) throw new AppError('Invalid google profile or email during Oauthentication',400);            
            const response:LinkCalendarAccountResponse = {
                accessToken:payload.access_token,
                refreshToken:payload.refresh_token,
                email:profile.email,               
                provider:"google"
            } 
            return response;
        }catch(err){
            throw err;
        }
    }
}