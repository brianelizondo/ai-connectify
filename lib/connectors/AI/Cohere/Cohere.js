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
const CohereClient = require('./CohereClient');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a Cohere AI instance
* Given a prompt, the model   builds natural language processing and generation
* @class Cohere
*/
class Cohere {
    /**
    * Create a Cohere instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere API
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize CohereClient with API key
        this.client = new CohereClient(apiKey);
    }

    
    /** 
    * setClientName
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        ValidationHelpers.validateStringInput(clientName, `A valid client name must be provided`);
        this.client.setClientName(clientName);
    }

    
    /** CHAT METHODS
    *
    * chat
    * Generates a text response to a user message
    * @async
    * @param {string} message - Text input for the model to respond to
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async chat(message, newConfig={}) {
        return this.client.chat(message, newConfig);
    }
    /**
    * chatWithStreaming
    * Generates a text response to a user message
    * @async
    * @param {string} message - Text input for the model to respond to
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async chatWithStreaming(message, newConfig={}) {
        return this.client.chatWithStreaming(message, newConfig);
    }
}

module.exports = Cohere;