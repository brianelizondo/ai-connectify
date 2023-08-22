/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const AIConnectifyError = require('../../AIConnectifyError');
const { Configuration, OpenAIApi } = require('openai');

/**
* Represents a ChatGPT AI instance.
* Given a prompt, the model will return one or more predicted completions, 
* and can also return the probabilities of alternative tokens at each position.
* @constructor
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class ChatGPT {
    constructor(apiKey) {
        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);
    }

    /**
    * MODELS METHODS
    * List and describe the various models available in the API. 
    * Refer to the Models documentation to understand what models are available and the differences between them.
    * 
    * List Models
    * Lists the currently available models, and provides basic information about each one such as the owner and availability.
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async listModels(){
        try {
            const response = await this.openai.listModels();
            return response.data.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }
    
    /**
    * Reatrive Model
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
    * @async
    * @param {String} modelID - The id model to get basic information.
    * @returns {Promise<Object>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async reatrieveModel(modelID) {
        if (typeof modelID !== 'string'){
            throw new AIConnectifyError('Cannot process the model ID');
        }

        try {
            const response = await this.openai.retrieveModel(modelID);
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * COMPLETIONS METHODS
    * Given a prompt, the model will return one or more predicted completions, 
    * and can also return the probabilities of alternative tokens at each position.
    * 
    * Create Completion
    * Creates a completion for the provided prompt and parameters
    * @async
    * @param {String} promptText - The prompt to generate a completion for.
    * @param {String} [modelID="text-davinci-003"] - The OpenAI GPT model ID to use.
    * @param {Object} [config={}] - Optional parameters for the  generation.
    * @returns {Promise<object>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async createCompletion(promptText = null, modelID = "text-davinci-003", config = {}) {
        if (!promptText || typeof promptText !== 'string'){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }
        if (typeof modelID !== 'string'){
            throw new AIConnectifyError('Cannot process the model ID');
        }
        
        try {
            const response = await this.openai.createCompletion({ promptText, modelID, ...config });
            return response.data.choices[0].text.trim();
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * CHAT
    * Given a list of messages describing a conversation, the model will return a response.
    * 
    * Create Chat Completion
    * Creates a model response for the given chat conversation.
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far.
    * @param {String} [modelID="gpt-3.5-turbo"] - The OpenAI GPT model ID to use.
    * @param {Object} [config={}] - Optional parameters for the generation.
    * @returns {Promise<Object>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async createChatCompletion(messagesArray = null, modelID = "gpt-3.5-turbo", config = {}) {
        if (!messagesArray || messagesArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty messages array');
        }else if (!Array.isArray(messagesArray)){
            throw new AIConnectifyError('Cannot process a not array of messages');
        }
        if (typeof modelID !== 'string'){
            throw new AIConnectifyError('Cannot process the model ID');
        }
        
        try {
            const response = await this.openai.createChatCompletion({ messagesArray, modelID, ...config });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * EDITS
    * Given a prompt and an instruction, the model will return an edited version of the prompt.
    * 
    * Create Edit
    * Creates a new edit for the provided input, instruction, and parameters.
    * @async
    * @param {String} instruction - The instruction that tells the model how to edit the prompt.
    * @param {String} [input=null] - The input text to use as a starting point for the edit.
    * @param {String} [modelID="text-davinci-edit-001"] - The OpenAI GPT model ID to use.
    * @param {Object} [config=null] - Optional parameters for the completion generation.
    * @returns {Promise<Object>} - A Promise that resolves with the generated completion.
    * @throws {AIConnectifyError} - Will throw an error if the prompt is empty or if an error occurs during completion generation.
    */
    async createEdit(instruction = null, input = null, modelID = "text-davinci-edit-001", config = null) {
        if (!instruction || typeof instruction !== 'string'){
            throw new AIConnectifyError('Cannot process an empty instruction');
        }
        if (typeof modelID !== 'string'){
            throw new AIConnectifyError('Cannot process the model ID');
        }
        
        try {
            const response = await this.openai.createEdit({ instruction, modelID, input, ...config });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }
}

module.exports = ChatGPT;