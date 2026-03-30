import { GoogleProvider } from "./providers/GoogleProvider.provider";
import { MicrosoftProvider } from "./providers/MicrosoftProvider";
import { CalendarAccountLinkProvider } from "./types";

export class LinkCalendarAccountFactory {
    private static providers:Record<string,CalendarAccountLinkProvider> = {
        google:new GoogleProvider(),
        microsoft:new MicrosoftProvider()        
    }
    static getProvider(name:string):CalendarAccountLinkProvider{
        const provider = this.providers[name.toLowerCase()]
        return provider;
    }
}