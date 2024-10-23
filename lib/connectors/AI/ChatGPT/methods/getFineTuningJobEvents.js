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
* Get status updates for a fine-tuning job
* @async
* @memberof ChatGPTClient
* @method getFineTuningJobEvents
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getFineTuningJobEvents(httpRequest, throwError, fine_tuning_job_id, newConfig){
    HelperFunctions.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

    try {
        const response = await httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, {
            params: { ...newConfig }
        });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getFineTuningJobEvents;