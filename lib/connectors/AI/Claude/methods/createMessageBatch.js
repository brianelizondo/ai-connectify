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
* (Beta) The Message Batches API can be used to process multiple Messages API requests at once
* @async
* @memberof ClaudeClient
* @method createMessageBatch
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} requests - List of requests for prompt completion. Each is an individual request to create a Message
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function createMessageBatch(httpRequest, throwError, requests) {
    HelperFunctions.validateArrayInput(requests, 'Cannot process the requests array');
    
    try {
        const response = await httpRequest.post('/messages/batches', { requests }, {
            headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
        });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createMessageBatch;