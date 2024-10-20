/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const ClaudeClient = require('./ClaudeClient');
const HelperFunctions = require('../../../helpers/HelperFunctions');

/**
* Represents a Claude AI instance
* Handles interaction with the Claude API for chat, completions, edits, and model information
* @exports Claude
* @class 
*/
class Claude {
    /**
    * Create a Claude instance
    * @constructor
    * @param {string} apiKey - The API key for Claude
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing Claude instance');
        
        // Initialize ClaudeClient with API key
        this.client = new ClaudeClient(apiKey);
    }

}

module.exports = Claude;