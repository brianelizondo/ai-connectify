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
* Returns a list of fine-tuned models available for use
* @async
* @memberof CohereClient
* @method getFineTunedModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getFineTunedModels(httpRequest, throwError, newConfig) {
    try {
        const response = await httpRequest.get('/v1/finetuning/finetuned-models', newConfig);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getFineTunedModels;