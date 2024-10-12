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
* Launches an async Embed job for a Dataset of type embed-input
* @async
* @memberof CohereClient
* @method createEmbedJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} dataset_id - ID of a Dataset. The Dataset must be of type embed-input
* @param {string} [modelID="embed-english-light-v3.0"] - (Optional) The ID of the model to use
* @param {string} [input_type="classification"] - (Optional) Specifies the type of input passed to the model
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function createEmbedJob(httpRequest, throwError, dataset_id, modelID, input_type, newConfig) {
    HelperFunctions.validateStringInput(dataset_id, 'Cannot process the dataset ID');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    HelperFunctions.validateStringInput(input_type, 'Cannot process the input type');
    
    try {
        const response = await httpRequest.post('/v1/embed-jobs', { ...newConfig, model: modelID, dataset_id, input_type });
        return response.job_id;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createEmbedJob;