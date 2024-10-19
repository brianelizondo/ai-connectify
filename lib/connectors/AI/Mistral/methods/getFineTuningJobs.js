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

/**
* Get a list of fine-tuning jobs for your organization and user
* @async
* @memberof MistralClient
* @method getFineTuningJobs
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getFineTuningJobs(httpRequest, throwError, newConfig){
    try {
        const response = await httpRequest.get('/fine_tuning/jobs', newConfig);
        return response.data;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getFineTuningJobs;