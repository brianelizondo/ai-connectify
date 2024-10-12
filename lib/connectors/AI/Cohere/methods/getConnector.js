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
* Retrieve a connector by ID
* @async
* @memberof CohereClient
* @method getConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the connector to retrieve.
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getConnector(httpRequest, throwError, connector_id) {
    HelperFunctions.validateStringInput(connector_id, 'Cannot process the connector ID');

    try {
        const response = await httpRequest.get(`/v1/connectors/${connector_id}`);
        return response.connector;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getConnector;