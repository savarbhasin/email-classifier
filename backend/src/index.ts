import { GoogleGenerativeAI } from "@google/generative-ai";
import { ErrorRequestHandler, Request, Response } from "express";
import { classifyEmails } from "./utils/langchain";

const express = require('express');
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());

// const API_KEY = process.env.GEMINI_API_KEY!;
// const genAI = new GoogleGenerativeAI(API_KEY);

// app.post('/classify', async(req:Request,res:Response)=>{
//     const data = req.body;
//     const d = JSON.stringify(data);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = ` you are an email analyst at a company and your task is to classify emails into different categories.
//     I will give you a json of array of email data (subject and snippet), classify the email on the basis of 
//     Important: Emails that are personal or work-related and require immediate attention.
//     Promotions: Emails related to sales, discounts, and marketing campaigns.
//     Social: Emails from social networks, friends, and family.
//     Marketing: Emails related to marketing, newsletters, and notifications.
//     Spam: Unwanted or unsolicited emails.
//     General: If none of the above are matched, use General
//     now return me a array with label as each element, DONOT GIVE ME ANY TYPE OF CODE ONLY GIVE ME AN ARRAY CONTATINING THE LABELS
        
//     ${d}`;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
    
//     return res.status(200).json({ text });


// })


app.post('/classify', async(req:Request,res:Response)=>{
    try{
        const {emails,apiKey} = req.body.data;
        const response = await classifyEmails(emails,apiKey);
        return res.status(200).json({text:response})
    } catch(e:any){
        return res.status(400).json({error:e.message})
    }
})

app.listen(5000,()=>{
    console.log('Server is running on port 5000')
})