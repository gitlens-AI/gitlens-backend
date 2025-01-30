import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { OpenAIContextType, RepositoryInfoType } from "../helpers/Types";

if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not set");
    process.exit(1);
}

class OpenAiService {
    private openai: OpenAI;
    private generationContext: OpenAIContextType;

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.generationContext = {};
    }

    validateCode = async (code: string) => {
        try {
            const messages: ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content:
                        "",
                },
                { role: "user", content: `Validate this code:\n\n${code}` },
            ];
            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: messages,
                model: "gpt-4o-mini",
            };
            const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
            return chatCompletion.choices[0].message.content || "Error: empty answer";
        } catch (e: any) {
            console.error("OpenAiService validateCode error:", e.message);
            return "Some error";
        }
    };

    generateCode = async (request: string, userAddress: string, isNew: boolean = true) => {
        try {
            const contextMessages = this.generationContext[userAddress];
            let messages: ChatCompletionMessageParam[];
            if (isNew === true || !contextMessages || contextMessages.messages.length === 0) {
                messages = [
                    {
                        role: "system",
                        content:
                            "",
                    },
                    { role: "user", content: request },
                ];
            } else {
                messages = contextMessages.messages;
                messages.push({ role: "user", content: request });
            }

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: messages,
                model: "gpt-4o-mini",
            };
            const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
            const responseMessage = chatCompletion.choices[0].message.content || "Error: empty answer";

            this.generationContext[userAddress] = {
                messages: [...messages, { role: "assistant", content: responseMessage }],
            };
            return responseMessage;
        } catch (e: any) {
            console.error("OpenAiService generateCode error:", e.message);
            return "Some error";
        }
    };

    validateRepository = async (repositoryInfo: RepositoryInfoType) => {
        try {
            const messages: ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: ``,
                },
                {
                    role: "user",
                    content: `Here is repository info object, make a short verdict about it:\n\n${JSON.stringify(
                        repositoryInfo
                    )}`,
                },
            ];
            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: messages,
                model: "gpt-4o-mini",
            };
            const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
            return chatCompletion.choices[0].message.content || "Error: empty answer";
        } catch (e: any) {
            console.error("OpenAiService validateRepository error:", e.message);
            return "Some error";
        }
    };
}

export default new OpenAiService();
