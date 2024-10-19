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
* Creates a fine-tuning job which begins the process of creating a new model from a given dataset
* @async
* @memberof MistralClient
* @method createFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} hyperparameters - The fine-tuning hyperparameter settings used in a fine-tune job
* @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function createFineTuningJob(httpRequest, throwError, hyperparameters, modelID, newConfig){
    HelperFunctions.validateStringInput(modelID, 'Cannot process the fine model ID');

    try {
        const response = await httpRequest.post('/fine_tuning/jobs', { ...newConfig, hyperparameters, model: modelID });
        return response;
    } catch (error) {
        throwError(error); 
    }
}

module.exports = createFineTuningJob;