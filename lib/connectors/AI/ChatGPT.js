'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import { Configuration, OpenAIApi } from 'openai';

/**
* Given a prompt, the model will return one or more predicted completions, 
* and can also return the probabilities of alternative tokens at each position.
*/
class ChatGPT {
    constructor(apiKey, model = "gpt-3.5-turbo") {
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
    */
    async createCompletion(prompt, config = null) {
        try {
            const response = await this.openai.createCompletion({ ...this.model, prompt, ...config });
            return response.data.choices[0].text.trim();
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }
}

export default ChatGPT;