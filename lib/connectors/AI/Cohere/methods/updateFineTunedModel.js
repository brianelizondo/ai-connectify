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
* Updates a fine-tuned model
* @async
* @memberof CohereClient
* @method updateFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The ID of the fine-tuned model
* @param {string} name - Fine-tuned model name
* @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function updateFineTunedModel(httpRequest, throwError, finetuned_model_id, name, settings, newConfig) {
    HelperFunctions.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');
    HelperFunctions.validateStringInput(name, 'Cannot process the fine-tuned model name');

    try {
        const response = await httpRequest.patch(`/v1/finetuning/finetuned-models/${finetuned_model_id}`, { ...newConfig, name, settings });
        return response.finetuned_model;
    } catch (error) {
        throwError(error);
    }
}

module.exports = updateFineTunedModel;