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
* Update a connector by ID
* @async
* @memberof CohereClient
* @method updateConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the connector to update
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function updateConnector(httpRequest, throwError, connector_id, newConfig) {
    HelperFunctions.validateStringInput(connector_id, 'Cannot process the connector ID');

    try {
        const response = await httpRequest.patch(`/v1/connectors/${connector_id}`, newConfig);
        return response.connector;
    } catch (error) { 
        throwError(error);
    }
}

module.exports = updateConnector;