import axios from 'axios';

export async function extractUsingAI(prompt, context) {
    try {
        console.log('Calling Ollama API to extract data...');

        const response = await axios.post(process.env.OLLAMA_API_URL, {
            model: process.env.OLLAMA_MODEL,
            stream: false,
            prompt: prompt + `<input> ${context} </input>`,
        });

        console.log('Response from Ollama API received.');

        return response.data.response;
    } catch (error) {
        console.error('Error extracting using AI:', error.message);
        throw error;
    }
}