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
* Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms
* @async
* @memberof ChatGPTClient
* @method createEmbeddings
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string|Array} input - Input text to embed, encoded as a string or array of tokens
* @param {string} [modelID="text-embedding-ada-002"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
async function createEmbeddings(httpRequest, throwError, input, modelID, newConfig) {
    ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/embeddings', { ...newConfig, input, model: modelID });
        return response.data;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createEmbeddings;