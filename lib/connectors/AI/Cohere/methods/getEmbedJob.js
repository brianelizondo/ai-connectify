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
* Retrieves the details about an embed job started by the same user
* @async
* @memberof CohereClient
* @method getEmbedJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} embed_job_id - The ID of the embed job to retrieve
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getEmbedJob(httpRequest, throwError, embed_job_id) {
    HelperFunctions.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
    try {
        const response = await httpRequest.get(`/v1/embed-jobs/${embed_job_id}`);
        delete response.meta;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getEmbedJob;