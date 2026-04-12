import env from "../../../../config/env";
import { LinkAccountInput } from "../../../controllers/v1/types";
import AppError from "../../../utils/appError.utils";
import { AccountLinkProvider,LinkAccountResponse } from "../types";
import { OAuth2Client } from "google-auth-library";
export class GoogleProvider implements AccountLinkProvider{
    private oAuthClient:OAuth2Client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    async link(payload: LinkAccountInput): Promise<LinkAccountResponse> {
        try{
            const ticket =await this.oAuthClient.verifyIdToken({
                idToken:payload.id_token,
                audience:env.GOOGLE_CLIENT_ID
            });
            const profile = ticket.getPayload();
            if(!profile || !profile.email) throw new AppError('Invalid google profile or email during Oauthentication',400);            
            const response:LinkAccountResponse = {
                accessToken:payload.access_token,
                refreshToken:payload.refresh_token,
                email:profile.email,
                password:null,
                imap_host:'imap.gmail.com',
                imap_port:993,
                smtp_host:'smtp.gmail.ocm',
                smtp_port:465,
                provider:"google"
            } 
            return response;
        }catch(err){
            throw err;
        }
    }
}