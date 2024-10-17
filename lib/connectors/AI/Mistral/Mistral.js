/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
const MistralClient = require('./MistralClient');
const HelperFunctions = require('../../../helpers/HelperFunctions');

/**
* Represents a Mistral AI instance
* Handles interaction with the Mistral API for multilingual, code generation, maths, and advanced reasoning capabilities.
* @exports Mistral
* @class 
*/
class Mistral {
    /**
    * Create a Mistral instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing Mistral instance');
        
        // Initialize MistralClient with API key
        this.client = new MistralClient(apiKey);
    }

}

module.exports = Mistral;