import env from "../../../../config/env";
import { IAiService } from "./ai.interface";
import { GeminiService } from "./providers/gemini.provider";
import { GroqService } from "./providers/groq.provider";

export class AIServiceFactory{
    static getProvider(name:string):IAiService{
        const aiProvider = name.toUpperCase() || "GEMINI"
        let providerInstance:IAiService;
        switch(aiProvider){
            case "GEMINI":
                providerInstance = new GeminiService();
                break;
            case "GROQ":
                providerInstance = new GroqService();
                break;
            default:
                providerInstance = new GeminiService();    
        }
        return providerInstance;
    }
}