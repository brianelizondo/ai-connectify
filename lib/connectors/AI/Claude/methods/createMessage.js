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
* Send a structured list of input messages with text and/or image content
* @async
* @memberof ClaudeClient
* @method createMessage
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - A list of messages describing the conversation so far
* @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
* @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function createMessage(httpRequest, throwError, messagesArray, modelID, maxTokens, newConfig) {
    HelperFunctions.validateArrayInput(messagesArray, 'Cannot process the messages array');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    HelperFunctions.validateNumberInput(maxTokens, 'Cannot process the max tokens value');
    
    try {
        const response = await httpRequest.post('/messages', { ...newConfig, messages: messagesArray, model: modelID, max_tokens: maxTokens });
        delete response.usage;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createMessage;