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
* Delete a fine-tuned model by ID
* @async
* @memberof CohereClient
* @method deleteFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The ID of the fine-tuned model
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function deleteFineTunedModel(httpRequest, throwError, finetuned_model_id) {
    HelperFunctions.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

    try {
        await httpRequest.delete(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
        return {
            finetuned_model_id,
            status: "deleted"
        };
    } catch (error) {
        throwError(error);
    }
}

module.exports = deleteFineTunedModel;