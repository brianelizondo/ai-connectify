/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
* @module 
*/
const AIConnectifyError = require('../AIConnectifyError');
const ValidationHelpers = require('../helpers/validationHelpers');
const { Configuration, OpenAIApi } = require('openai');

/**
* Represents a service for interacting with the ChatGPT API
* @class ChatGPTService
*/
class ChatGPTService {
    /**
    * Create a ChatGPT service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);
    }

    /**
    * SERVICES METHODS
    * List and describe the various models available in the API
    * 
    * List Models
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
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
    * @async
    * @param {string} modelID - The id model to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async reatrieveModel(modelID) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process the model ID');

        try {
            const response = await this.openai.retrieveModel(modelID);
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * Create Completion
    * @async
    * @param {string} promptText - The prompt to generate a completion for
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the  generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createCompletion(promptText, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createCompletion({ promptText, modelID, ...newConfig });
            return response.data.choices[0].text.trim();
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * Create Chat Completion
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createChatCompletion(messagesArray, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(messagesArray, 'Cannot process an empty messages array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createChatCompletion({ messagesArray, modelID, ...newConfig });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }

    /**
    * Create Edit
    * @async
    * @param {string} instruction - The instruction that tells the model how to edit the prompt
    * @param {string} input - The input text to use as a starting point for the edit
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the completion generation
    * @returns {Promise<string>} - A Promise that resolves with the generated completion
    * @throws {AIConnectifyError} - Will throw an error if the prompt is empty or if an error occurs during completion generation
    */
    async createEdit(instruction, input, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(instruction, 'Cannot process an empty instruction');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createEdit({ instruction, modelID, input, ...newConfig });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }
}

module.exports = ChatGPTService;