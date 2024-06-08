import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

interface inputType{
    subject:string,
    snippet:string
}

export const classifyEmails = async (data:inputType[], key:string) => {
    
    const models = new ChatOpenAI({openAIApiKey:key,model:'gpt-4o'});

    const promptTemplate = `You are an email analyst at a company and your task is to classify emails into different categories.
    I will give you a json array of email data (subject and snippet). Classify the emails based on the following categories:
    - Important: Emails that are personal or work-related and require immediate attention.
    - Promotions: Emails related to sales, discounts, and marketing campaigns.
    - Social: Emails from social networks, friends, and family.
    - Marketing: Emails related to marketing, newsletters, and notifications.
    - Spam: Unwanted or unsolicited emails.
    - General: If none of the above categories are matched, use General.
    Return an array with the label for each email, without any additional text or code. {data}`;

    const prompt = PromptTemplate.fromTemplate(promptTemplate)

    const chain = prompt.pipe(models);

    const response = await chain.invoke({data:JSON.stringify(data)})

    return response.content;
};
