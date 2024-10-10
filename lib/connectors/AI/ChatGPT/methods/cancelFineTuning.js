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
* Immediately cancel a fine-tune job
* @async
* @memberof ChatGPTClient
* @method cancelFineTuning
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the fine-tuning job to cancel
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function cancelFineTuning(httpRequest, throwError, fine_tuning_job_id){
    HelperFunctions.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

    try {
        const response = await httpRequest.post(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = cancelFineTuning;