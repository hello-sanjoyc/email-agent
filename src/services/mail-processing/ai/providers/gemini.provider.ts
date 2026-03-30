import { GoogleGenAI } from "@google/genai";
import { IAiService } from "../ai.interface";
import { EmailClassificationOutput } from "../../types";
import env from "../../../../config/env";
import { systemPrompt } from "../prompts";

export class GeminiService implements IAiService {
    private systemPrompt = systemPrompt;
    private client = new GoogleGenAI({apiKey:env.GEMINI_API_KEY});    
    generateUserPrompt(subject:string,date:string,bodySummary:string):string{
        return `Date: ${date}
        Subject: ${subject} 
        Body: ${bodySummary}`
    }
    async classifyEmail(userPrompt: string): Promise<EmailClassificationOutput> {        
        const result = await this.client.models.generateContent({
            model: env.GEMINI_MODEL, // Use 'gemini-2.0-flash' or 'gemini-1.5-flash'
            contents: [
                {
                    role: "user",
                    parts: [{ text: `Input Data:\n${userPrompt}` }]
                }
            ],
            config: {
                // MOVE systemInstruction INSIDE CONFIG
                systemInstruction: this.systemPrompt, 
                responseMimeType: 'application/json',
                temperature: 0.1
            }
        });

        // Use .text directly in the new SDK
        return JSON.parse(result.text ?? "{}") as EmailClassificationOutput;
    }
}