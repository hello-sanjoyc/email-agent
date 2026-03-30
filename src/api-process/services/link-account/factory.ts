import { CustomProvider } from "./providers/CustomProvider.provider";
import { GoogleProvider } from "./providers/GoogleProvider.provider";
import { MicrosoftProvider } from "./providers/MicrosoftProvider";
import { AccountLinkProvider } from "./types";

export class LinkAccountFactory {
    private static providers:Record<string,AccountLinkProvider> = {
        google:new GoogleProvider(),
        microsoft:new MicrosoftProvider(),
        custom:new CustomProvider(),
    }
    static getProvider(name:string):AccountLinkProvider{
        const provider = this.providers[name.toLowerCase()]
        return provider;
    }
}