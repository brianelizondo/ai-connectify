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
* Get a list of fine-tuning jobs for your organization and user
* @async
* @memberof MistralClient
* @method updateFineTuningModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_model_id - The ID of the model to update
* @param {Object} [newConfig={}] - (Optional) (Optional) Name and description to update the model
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function updateFineTuningModel(httpRequest, throwError, fine_tuning_model_id, newConfig){
    HelperFunctions.validateStringInput(fine_tuning_model_id, 'Cannot process the fine tunning model ID');

    try {
        const response = await httpRequest.patch(`/fine_tuning/models/${fine_tuning_model_id}`, newConfig);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = updateFineTuningModel;