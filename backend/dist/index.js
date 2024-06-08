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
const generative_ai_1 = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const API_KEY = 'AIzaSyAUORd1_TwBxQwGtZqBiEGM63rl5XQS9Kk';
const genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
app.post('/classify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const d = JSON.stringify(data);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = ` you are an email analyst at a company and your task is to classify emails into different categories.
    I will give you a json of array of email data (subject and snippet), classify the email on the basis of 
    Important: Emails that are personal or work-related and require immediate attention.
    Promotions: Emails related to sales, discounts, and marketing campaigns.
    Social: Emails from social networks, friends, and family.
    Marketing: Emails related to marketing, newsletters, and notifications.
    Spam: Unwanted or unsolicited emails.
    General: If none of the above are matched, use General
    now return me a array with label as each element, DONOT GIVE ME ANY TYPE OF CODE ONLY GIVE ME AN ARRAY CONTATINING THE LABELS
        
    ${d}`;
    const result = yield model.generateContent(prompt);
    const response = yield result.response;
    const text = response.text();
    return res.status(200).json({ text });
}));
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
