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
* Request the start of a validated fine tuning job
* @async
* @memberof MistralClient
* @method startFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the job to analyse
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function startFineTuningJob(httpRequest, throwError, fine_tuning_job_id){
    HelperFunctions.validateStringInput(fine_tuning_job_id, 'Cannot process the fine tunning job ID');

    try {
        const response = await httpRequest.post(`/fine_tuning/jobs/${fine_tuning_job_id}/start`);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = startFineTuningJob;