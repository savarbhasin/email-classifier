"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyEmails = void 0;
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const classifyEmails = (data, key) => __awaiter(void 0, void 0, void 0, function* () {
    const models = new openai_1.ChatOpenAI({ openAIApiKey: key, model: 'gpt-3.5-turbo-16k' });
    const promptTemplate = `You are an email analyst at a company and your task is to classify emails into different categories.
    I will give you a json array of email data (subject and snippet). Classify the emails based on the following categories:
    - Important: Emails that are personal or work-related and require immediate attention.
    - Promotions: Emails related to sales, discounts, and marketing campaigns.
    - Social: Emails from social networks, friends, and family.
    - Marketing: Emails related to marketing, newsletters, and notifications.
    - Spam: Unwanted or unsolicited emails.
    - General: If none of the above categories are matched, use General.
    Return an array with the label for each email, without any additional text or code. {data}`;
    const prompt = prompts_1.PromptTemplate.fromTemplate(promptTemplate);
    const chain = prompt.pipe(models);
    const response = yield chain.invoke({ data: JSON.stringify(data) });
    return response.content;
});
exports.classifyEmails = classifyEmails;
