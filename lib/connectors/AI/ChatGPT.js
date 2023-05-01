/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import { Configuration, OpenAIApi } from 'openai';

/**
* Represents a ChatGPT AI instance.
* Given a prompt, the model will return one or more predicted completions, 
* and can also return the probabilities of alternative tokens at each position.
* @constructor
* @param {string} apiKey - The OpenAI API key.
* @param {string} [model="text-davinci-003"] - The name of the OpenAI GPT model to use.
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class ChatGPT {
    constructor(apiKey, model = "text-davinci-003") {
        if (!apiKey) {
            throw new AIConnectifyError('API key is required for ChatGPT');
        }

        this.apiKey = apiKey;
        this.model = model;

        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);
    }

    /**
    * Creates a completion for the provided prompt and parameters
    * @async
    * @param {string} prompt - The prompt to generate a completion for.
    * @param {Object} [config=null] - Optional parameters for the completion generation.
    * @returns {Promise<string>} - A Promise that resolves with the generated completion.
    * @throws {AIConnectifyError} - Will throw an error if the prompt is empty or if an error occurs during completion generation.
    */
    async createCompletion(prompt, config = null) {
        if (prompt.length == 0){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }
        
        try {
            const response = await this.openai.createCompletion({ prompt, model: this.model, ...config });
            return response.data.choices[0].text.trim();
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }
}

export default ChatGPT;