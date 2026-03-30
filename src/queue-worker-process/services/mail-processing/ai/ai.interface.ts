import { EmailClassificationOutput } from "../types";

export interface IAiService{
    generateUserPrompt(subject:string,date:string,bodySummary:string):string,
    classifyEmail(userPrompt:string):Promise<EmailClassificationOutput>
}