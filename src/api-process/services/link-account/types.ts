import { LinkAccountInput } from "../../controllers/v1/types";

export interface LinkAccountResponse {
    accessToken:string|null;
    refreshToken:string|null;
    email:string;
    password:string|null;
    imap_host:string|null;
    imap_port:number|null;
    smtp_host:string|null;
    smtp_port:number|null;
    provider:string;
}
export interface AccountLinkProvider {
    link(payload:LinkAccountInput):Promise<LinkAccountResponse>;
}
