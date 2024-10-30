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
* Delete a connector by ID
* @async
* @memberof CohereClient
* @method deleteConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the dataset to delete
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function deleteConnector(httpRequest, throwError, connector_id) {
    HelperFunctions.validateStringInput(connector_id, 'Cannot process the connector ID');

    try {
        await httpRequest.delete(`/v1/connectors/${connector_id}`);
        return {
            connector_id,
            status: "deleted"
        };
    } catch (error) {
        throwError(error);
    }
}

module.exports = deleteConnector;