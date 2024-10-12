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
* Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
* @async
* @memberof CohereClient
* @method embed
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} texts - An array of strings for the model to embed
* @param {string} [modelID="embed-english-v2.0"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function embed(httpRequest, throwError, texts, modelID, newConfig) {
    HelperFunctions.validateArrayInput(texts, 'Cannot process the texts array');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/v2/embed', { ...newConfig, texts, model: modelID });
        delete response.meta;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = embed;