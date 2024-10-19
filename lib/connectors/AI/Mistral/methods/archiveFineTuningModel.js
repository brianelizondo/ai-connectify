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
* Archive a fine-tuned model
* @async
* @memberof MistralClient
* @method archiveFineTuningModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_model_id - The ID of the model to archive
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function archiveFineTuningModel(httpRequest, throwError, fine_tuning_model_id){
    HelperFunctions.validateStringInput(fine_tuning_model_id, 'Cannot process the fine tunning model ID');

    try {
        const response = await httpRequest.post(`/fine_tuning/models/${fine_tuning_model_id}/archive`);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = archiveFineTuningModel;