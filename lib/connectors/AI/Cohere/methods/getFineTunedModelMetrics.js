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
* Retrieves metrics measured during the training of a fine-tuned model
* @async
* @memberof CohereClient
* @method getFineTunedModelMetrics
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The parent fine-tuned model ID
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getFineTunedModelMetrics(httpRequest, throwError, finetuned_model_id, newConfig) {
    HelperFunctions.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

    try {
        const response = await httpRequest.get(`/v1/finetuning/finetuned-models/${finetuned_model_id}/training-step-metrics`, {
            params: { ...newConfig }
        });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getFineTunedModelMetrics;