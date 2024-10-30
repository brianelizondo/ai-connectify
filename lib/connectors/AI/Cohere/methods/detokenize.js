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
* Takes tokens using byte-pair encoding and returns their text representation
* @async
* @memberof CohereClient
* @method detokenize
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} tokens The string to be tokenized
* @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function detokenize(httpRequest, throwError, tokens, modelID) {
    HelperFunctions.validateArrayInput(tokens, 'Cannot process the tokens array');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');

    try {
        const response = await httpRequest.post('/v1/detokenize', { tokens, model: modelID });
        delete response.meta;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = detokenize;