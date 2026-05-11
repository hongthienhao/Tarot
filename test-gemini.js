import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        frequencyPenalty: 0.6,
        presencePenalty: 0.6,
        maxOutputTokens: 2048,
      }
    });
    const result = await model.generateContent('Hello');
    console.log(result.response.text());
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
