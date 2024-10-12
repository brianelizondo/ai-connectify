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
* Retrieves the dataset storage usage for your Organization
* @async
* @memberof CohereClient
* @method getDatasetUsage
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getDatasetUsage(httpRequest, throwError, ) {
    try {
        const response = await httpRequest.get('/v1/datasets/usage');
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getDatasetUsage;