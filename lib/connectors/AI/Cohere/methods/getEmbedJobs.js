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
* Generates a list embed job endpoint allows users to view all embed jobs history for that specific user
* @async
* @memberof CohereClient
* @method getEmbedJobs
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getEmbedJobs(httpRequest, throwError) {
    try {
        const response = await httpRequest.get('/v1/embed-jobs');
        return response.embed_jobs;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getEmbedJobs;