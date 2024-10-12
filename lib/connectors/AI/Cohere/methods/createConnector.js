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
* Creates a new connector
* @async
* @memberof CohereClient
* @method createConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} name - A human-readable name for the connector
* @param {string} url - The URL of the connector that will be used to search for documents
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function createConnector(httpRequest, throwError, name, url, newConfig) {
    HelperFunctions.validateStringInput(name, 'Cannot process the name');
    HelperFunctions.validateStringInput(url, 'Cannot process the url');

    try {
        const response = await httpRequest.post('/v1/connectors', { ...newConfig, name, url });
        return response.connector;
    } catch (error) { 
        throwError(error);
    }
}

module.exports = createConnector;