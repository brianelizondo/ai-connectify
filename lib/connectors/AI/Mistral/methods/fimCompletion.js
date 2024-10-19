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
* Fill-in-the-middle API
* @async
* @memberof MistralClient
* @method fimCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} prompt - The text/code to complete
* @param {string} [modelID="codestral-2405"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function fimCompletion(httpRequest, throwError, prompt, modelID, newConfig) {
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/fim/completions', { ...newConfig, prompt, model: modelID });
        delete response.usage;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = fimCompletion;