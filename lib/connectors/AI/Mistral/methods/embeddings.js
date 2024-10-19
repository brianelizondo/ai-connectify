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
* Embeddings API
* @async
* @memberof MistralClient
* @method embeddings
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String|Array} input - Input (string) or Array of Input (strings) (Input)
* @param {string} modelID - The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function embeddings(httpRequest, throwError, input, modelID, newConfig) {
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/embeddings', { ...newConfig, input, model: modelID });
        delete response.data;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = embeddings;