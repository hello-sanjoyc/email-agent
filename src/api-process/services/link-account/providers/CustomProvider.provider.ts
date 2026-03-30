import { LinkAccountInput } from "../../../controllers/v1/types";
import AppError from "../../../utils/appError.utils";
import { AccountLinkProvider,LinkAccountResponse } from "../types";

export class CustomProvider implements AccountLinkProvider{
    async link(payload: LinkAccountInput): Promise<LinkAccountResponse> {
        try{
            if(!payload.email || !payload.password) throw new AppError('Invalid email and app password',400);
            const response:LinkAccountResponse = {
                accessToken:null,
                refreshToken:null,                
                email:payload.email,
                password:payload.password,
                imap_host:payload.imap_host,
                imap_port:Number(payload.imap_port),
                smtp_host:payload.smtp_host,
                smtp_port:Number(payload.smtp_port),
                provider:"custom"
            } 
            return response;
        }catch(err){
            throw err;
        }
    }
}