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
* Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE)
* @async
* @memberof CohereClient
* @method tokenize
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} text The string to be tokenized
* @param {string} [modelID="command"] - (Optional) The ID of the model to use
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function tokenize(httpRequest, throwError, text, modelID) {
    HelperFunctions.validateStringInput(text, 'Cannot process the text');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');

    try {
        const response = await httpRequest.post('/v1/tokenize', { text, model: modelID });
        delete response.meta;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = tokenize;