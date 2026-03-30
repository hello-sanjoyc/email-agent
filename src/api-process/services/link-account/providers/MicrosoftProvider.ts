import { LinkAccountInput } from "../../../controllers/v1/types";
import AppError from "../../../utils/appError.utils";
import { AccountLinkProvider, LinkAccountResponse } from "../types";

export class MicrosoftProvider implements AccountLinkProvider{
    async link(payload: LinkAccountInput): Promise<LinkAccountResponse> {
        try{
            const base64TokenPayload = payload.id_token.split('.')[1];
            const decodedTokenPayload = JSON.parse(Buffer.from(base64TokenPayload,'base64').toString());
            const email = decodedTokenPayload.email || decodedTokenPayload.preferred_username;
            if(!email)throw new AppError("Invalid microsoft ID token: email not found",400);
            const response:LinkAccountResponse = {
                accessToken:payload.access_token,
                refreshToken:payload.refresh_token,
                email,
                password:null,
                imap_host:null,
                imap_port:null,
                smtp_host:null,
                smtp_port:null,
                provider:"microsoft"
            } 
            return response;
        }catch(err){
            throw err;
        }
    }
}