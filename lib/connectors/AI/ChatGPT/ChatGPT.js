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
const ChatGPTService = require('../../services/ChatGPTService');

/**
* Represents a ChatGPT AI instance.
* Given a prompt, the model will return one or more predicted completions, 
* and can also return the probabilities of alternative tokens at each position
* @class ChatGPT
*/
class ChatGPT {
    /**
    * Create a ChatGPT instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        // get a new service instance
        this.service = new ChatGPTService(apiKey);
    }

    /**
    * MODELS METHODS
    * List and describe the various models available in the API
    * Refer to the Models documentation to understand what models are available and the differences between them
    * 
    * List Models
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async listModels(){
        // Returns the corresponding method in the service client
        return this.service.listModels();
    }
    
    /**
    * Reatrive Model
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The id model to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async reatrieveModel(modelID) {
        // Returns the corresponding method in the service client
        return this.service.retrieveModel(modelID);
    }

    /**
    * COMPLETIONS METHODS
    * Given a prompt, the model will return one or more predicted completions, 
    * and can also return the probabilities of alternative tokens at each position
    * 
    * Create Completion
    * Creates a completion for the provided prompt and parameters
    * @async
    * @param {string} promptText - The prompt to generate a completion for
    * @param {string} [modelID="text-davinci-003"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the  generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createCompletion(promptText, modelID = "text-davinci-003", newConfig = {}) {
        // Returns the corresponding method in the service client
        return this.service.createCompletion(promptText, modelID, newConfig);
    }

    /**
    * CHAT
    * Given a list of messages describing a conversation, the model will return a response
    * 
    * Create Chat Completion
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} [modelID="gpt-3.5-turbo"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createChatCompletion(messagesArray, modelID = "gpt-3.5-turbo", newConfig = {}) {
        // Returns the corresponding method in the service client
        return this.service.createChatCompletion(messagesArray, modelID, newConfig);
    }

    /**
    * EDITS
    * Given a prompt and an instruction, the model will return an edited version of the prompt
    * 
    * Create Edit
    * Creates a new edit for the provided input, instruction, and parameters
    * @async
    * @param {string} instruction - The instruction that tells the model how to edit the prompt
    * @param {string} [input=null] - The input text to use as a starting point for the edit
    * @param {string} [modelID="text-davinci-edit-001"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the completion generation
    * @returns {Promise<string>} - A Promise that resolves with the generated completion
    * @throws {AIConnectifyError} - Will throw an error if the prompt is empty or if an error occurs during completion generation
    */
    async createEdit(instruction, input = null, modelID = "text-davinci-edit-001", newConfig = {}) {
        // Returns the corresponding method in the service client
        return this.service.createEdit(instruction, input, modelID, newConfig);
    }
}

module.exports = ChatGPT;