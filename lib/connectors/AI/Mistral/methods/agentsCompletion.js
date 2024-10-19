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
* Agents API
* @async
* @memberof MistralClient
* @method agentsCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
* @param {string} agentID - The ID of the agent to use for this completion
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
async function agentsCompletion(httpRequest, throwError, messagesArray, agentID, newConfig) {
    HelperFunctions.validateStringArray(messagesArray, 'Cannot process the message array');
    HelperFunctions.validateStringInput(agentID, 'Cannot process the agent ID');
    
    try {
        const response = await httpRequest.post('/agents/completions', { ...newConfig, messages: messagesArray, agent_id: agentID });
        delete response.usage;
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = agentsCompletion;