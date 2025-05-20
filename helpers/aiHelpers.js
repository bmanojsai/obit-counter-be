import axios from 'axios';


export async function extractUsingAI(prompt, context) {
    try {
        const OLLAMA_API_ENDPOINT = process.env.OLLAMA_API_ENDPOINT || 'http://localhost:11434';
        console.log('Calling Ollama API to extract data...');

        const response = await axios.post(`${OLLAMA_API_ENDPOINT}/api/generate`, {
            model: process.env.OLLAMA_MODEL || 'llama2',
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