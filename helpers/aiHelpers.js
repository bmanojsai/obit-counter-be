import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

export async function extractUsingAI(prompt, context) {
    try {
        const AI_TYPE = process.env.AI_TYPE || 'ollama';
        console.log('AI Type:', AI_TYPE);

        if (AI_TYPE === 'ollama') {
            return await extractUsingOllama(prompt, context);
        }
        if (AI_TYPE === 'gemini') {
            return await extractUsingGeminiAPI(prompt, context);
        }
    } catch (error) {
        console.error('Error extracting using AI:', error.message);
        throw error;
    }
}

export async function extractUsingGeminiAPI(prompt, context) {
    const geminiAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "API_KEY_TO_FAIL" });

    try {
        const response = await geminiAi.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt + `<input> ${context} </input>`,
        });

        const jsonFenceStart = '```json';
        const jsonFenceEnd = '```';

        let generatedText = response.text;

        if (generatedText.startsWith(jsonFenceStart) && generatedText.endsWith(jsonFenceEnd)) {
            generatedText = generatedText.substring(jsonFenceStart.length);
            if (generatedText.startsWith('\n')) { 
                generatedText = generatedText.substring(1);
            }

            if (generatedText.endsWith('\n')) { 
                generatedText = generatedText.substring(0, generatedText.length - 1);
            }
            generatedText = generatedText.substring(0, generatedText.length - jsonFenceEnd.length);
        }
        
        console.log('Response from Gemini API received.');

        return generatedText;
    } catch (error) {
        console.error('Error extracting using Gemini API:', error.message);
        throw error;
    }
}

export async function extractUsingOllama(prompt, context) {
    try {
        const OLLAMA_API_ENDPOINT = process.env.OLLAMA_API_ENDPOINT || 'http://localhost:11434';
        console.log('Calling Ollama API to extract data...');

        const response = await axios.post(`${OLLAMA_API_ENDPOINT}/api/generate`, {
            model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
            stream: false,
            prompt: prompt + `<input> ${context} </input>`,
        });

        console.log('Response from Ollama API received.');

        return response.data.response;
    } catch (error) {
        console.error('Error extracting using Ollama:', error.message);
        throw error;
    }
}