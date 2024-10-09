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
const ValidationHelpers = require('../../../../helpers/validationHelpers');

/**
* Creates a model response for the given chat conversation
* @async
* @memberof ChatGPTClient
* @method createChatCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - A list of messages describing the conversation so far
* @param {string} [modelID="gpt-3.5-turbo"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function createChatCompletion(httpRequest, throwError, messagesArray, modelID, newConfig) {
    ValidationHelpers.validateArrayInput(messagesArray, 'Cannot process the messages array');
    ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/chat/completions', { ...newConfig, messages: messagesArray, model: modelID });
        delete response.usage;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createChatCompletion;