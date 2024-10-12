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
* Generates a list datasets that have been created
* @async
* @memberof CohereClient
* @method getDatasets
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getDatasets(httpRequest, throwError, newConfig) {
    try {
        const response = await httpRequest.get('/v1/datasets', newConfig);
        return response.datasets;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getDatasets;