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
* Authorize with oAuth a connector by ID
* @async
* @memberof CohereClient
* @method authorizeConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the connector to authorize
* @param {string} [afterTokenRedirectUrl=false] - (Optional) The URL to redirect to after the connector has been authorized
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function authorizeConnector(httpRequest, throwError, connector_id, afterTokenRedirectUrl) {
    HelperFunctions.validateStringInput(connector_id, 'Cannot process the connector ID');

    let endpoint;
    if(afterTokenRedirectUrl){
        HelperFunctions.validateStringInput(afterTokenRedirectUrl, 'Cannot process the after token redirect URL');
        endpoint = `/v1/connectors/${connector_id}/oauth/authorize?after_token_redirect=${afterTokenRedirectUrl}`;
    }else{
        endpoint = `/v1/connectors/${connector_id}/oauth/authorize`;
    }

    try {
        const response = await httpRequest.post(endpoint);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = authorizeConnector;