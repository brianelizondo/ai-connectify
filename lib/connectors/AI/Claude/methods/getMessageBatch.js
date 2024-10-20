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
* @method getMessageBatch
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} messageBatchID - ID of the Message Batch
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function getMessageBatch(httpRequest, throwError, messageBatchID) {
    HelperFunctions.validateStringInput(messageBatchID, 'Cannot process the message batch ID');
    
    try {
        const response = await httpRequest.get(`/messages/batches/${messageBatchID}`, {
            headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
        });
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getMessageBatch;