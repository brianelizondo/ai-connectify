/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
const MistralClient = require('./MistralClient');
const HelperFunctions = require('../../../helpers/HelperFunctions');

/**
* Represents a Mistral AI instance
* Handles interaction with the Mistral API for multilingual, code generation, maths, and advanced reasoning capabilities.
* @exports Mistral
* @class 
*/
class Mistral {
    /**
    * Create a Mistral instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing Mistral instance');
        
        // Initialize MistralClient with API key
        this.client = new MistralClient(apiKey);
    }

    /** MODELS METHODS **/
    /**
    * List all models available to the user
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(){
        return this.client.getModels();
    }

    /**
    * Retrieve a model information
    * @async
    * @param {string} modelID - The ID of the model to use for this request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModel(modelID) {
        return this.client.getModel(modelID);
    }


    /** CHAT METHODS **/
    /**
    * Chat Completion API
    * @async
    * @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
    * @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createChatCompletion(messagesArray, modelID="mistral-small-latest", newConfig={}) {
        return this.client.createChatCompletion(messagesArray, modelID, newConfig);
    }

}

module.exports = Mistral;