import env from "../../../config/env";
import { IAiService } from "./ai.interface";
import { GeminiService } from "./providers/gemini.provider";
import { GroqService } from "./providers/groq.provider";

export class AIServiceFactory{
    static getProvider():IAiService{
        const aiProvider = env.ACTIVE_AI_PROVIDER || "GROQ"
        let providerInstance:IAiService;
        switch(aiProvider){
            case "GEMINI":
                providerInstance = new GeminiService();
                break;
            case "GROQ":
                providerInstance = new GroqService();
                break;
            default:
                providerInstance = new GroqService();    
        }
        return providerInstance;
    }
}