import openAI from "openai"
export const openai = new openAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
   
});