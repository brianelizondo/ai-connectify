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
* Allows to cancel an active embed job
* @async
* @memberof CohereClient
* @method cancelEmbedJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} embed_job_id - The ID of the embed job to cancel
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function cancelEmbedJob(httpRequest, throwError, embed_job_id) {
    HelperFunctions.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
    try {
        await httpRequest.post(`/v1/embed-jobs/${embed_job_id}/cancel`);
        return {
            embed_job_id,
            status: "canceled"
        };
    } catch (error) {
        throwError(error);
    }
}

module.exports = cancelEmbedJob;