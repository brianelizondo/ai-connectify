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
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Cohere API
* @class CohereClient
*/
class CohereClient {
    /**
    * Create a Cohere service instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere
    */
    constructor(apiKey) {
        this.aiName = 'Cohere';
        this.aiApiKey = apiKey;
        this.httpRequest = new HttpClient('https://api.cohere.com/v1', { Authorization: `Bearer ${apiKey}` });
    }

    /** 
    * setClientName
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        this.httpRequest = new HttpClient('https://api.cohere.com/v1', { Authorization: `Bearer ${this.aiApiKey}`, 'X-Client-Name': clientName });
    }
    /**
    * throwError
    * Throw a formatted AIConnectifyError with the AI service and error message.
    * @param {Object} error - The error object caught during the request.
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description.
    */
    throwError(error){
        const errorMsg = error.response ? error.response.data.error.message : error.message;
        throw new AIConnectifyError(`${this.aiName} error => ${errorMsg}`);
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
    async chat(message, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(message, 'Cannot process the message input');
        
        try {
            const response = await this.httpRequest.post('/chat', { ...newConfig, message, stream: false });
            return {
                response_id: response.response_id,
                text: response.text,
                generation_id: response.generation_id,
                chat_history: response.chat_history
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async chatWithStreaming(message, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(message, 'Cannot process the message input');
        
        try {
            const response = await this.httpRequest.post('/chat', { ...newConfig, message, stream: true });
            const linesFromResponse = response.split('\n');
            const objectsFromResponse = linesFromResponse.map(line => JSON.parse(line));            
            return objectsFromResponse;
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = CohereClient;