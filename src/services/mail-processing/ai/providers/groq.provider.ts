import Groq from 'groq-sdk'
import env from '../../../../config/env'
import { EmailClassificationOutput } from '../../types';
import { systemPrompt } from '../prompts';
import { IAiService } from '../ai.interface';
export class GroqService implements IAiService{
    private client = new Groq({apiKey:env.GROQ_API_KEY});
    private systemPrompt = systemPrompt;
    generateUserPrompt(subject:string,date:string,bodySummary:string):string{
        return `Date: ${date}
        Subject: ${subject}
        Body: ${bodySummary}`
    }
    async classifyEmail(userPrompt:string):Promise<EmailClassificationOutput>{
        const response = await this.client.chat.completions.create({
            model:env.GROQ_MODEL,
            messages:[
                {
                    role:"system",
                    content:this.systemPrompt
                },
                {
                    role:"user",
                    content:userPrompt
                }
            ],
            response_format:{type:"json_object"}
        });
        return JSON.parse(response.choices[0].message.content || "{}") as EmailClassificationOutput;
    }
}