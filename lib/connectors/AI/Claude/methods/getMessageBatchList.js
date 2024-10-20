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
* (Beta) List all Message Batches within a Workspace
* @async
* @memberof ClaudeClient
* @method getMessageBatchList
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function getMessageBatchList(httpRequest, throwError, newConfig) {
    
    try {
        const response = await httpRequest.get('/messages/batches', {
            params: { ...newConfig },
            headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
        });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getMessageBatchList;