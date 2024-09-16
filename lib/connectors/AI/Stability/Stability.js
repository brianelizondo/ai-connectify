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
const StabilityClient = require('./StabilityClient');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a Stability AI instance.
* Handles interaction with the Stability API for chat, completions, edits, and model information.
* @class ChatGPT
*/
class Stability {
    /**
    * Create a Stability instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize StabilityClient with API key
        this.client = new StabilityClient(apiKey);
    }

}

module.exports = Stability;