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
const HelperFunctions = require('../../../../helpers/HelperFunctions');

/**
* Generates a text response to a user message with streaming (stream of events)
* @async
* @memberof CohereClient
* @method chatWithStreaming
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messages - Array of text input for the model to respond to
* @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function chatWithStreaming(httpRequest, throwError, messages, modelID, newConfig) {
    HelperFunctions.validateArrayInput(messages, 'Cannot process the messages');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/v2/chat', { 
            response_format: { type: 'json_object' },
            ...newConfig, 
            messages, 
            stream: true, 
            model: modelID 
        });
        const linesFromResponse = response.split('\n');
        const objectsFromResponse = linesFromResponse.map(line => JSON.parse(line));            
        return objectsFromResponse;
    } catch (error) {
        throwError(error);
    }
}

module.exports = chatWithStreaming;