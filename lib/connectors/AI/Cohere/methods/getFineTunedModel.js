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
* Retrieve a fine-tuned model by ID
* @async
* @memberof CohereClient
* @method getFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The fine-tuned model ID
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getFineTunedModel(httpRequest, throwError, finetuned_model_id) {
    HelperFunctions.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

    try {
        const response = await httpRequest.get(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
        return response.finetuned_model;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getFineTunedModel;