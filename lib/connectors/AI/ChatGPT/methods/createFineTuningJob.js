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
* @memberof ChatGPTClient
* @method createFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} training_file_id - The ID of an uploaded file that contains training data
* @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
async function createFineTuningJob(httpRequest, throwError, training_file_id, modelID, newConfig) {
    HelperFunctions.validateStringInput(training_file_id, 'Cannot process the training file ID');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const response = await httpRequest.post('/fine_tuning/jobs', { ...newConfig, training_file: training_file_id, model: modelID });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createFineTuningJob;