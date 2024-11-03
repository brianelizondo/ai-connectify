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
* Request the cancellation of a fine tuning job
* @async
* @memberof MistralClient
* @method cancelFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the job to analyse
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function cancelFineTuningJob(httpRequest, throwError, fine_tuning_job_id){
    HelperFunctions.validateStringInput(fine_tuning_job_id, 'Cannot process the fine tunning job ID');

    try {
        const response = await httpRequest.post(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = cancelFineTuningJob;