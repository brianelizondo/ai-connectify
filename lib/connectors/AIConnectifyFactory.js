/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
* @module AIConnectifyFactory
*/
const HelperFunctions = require('../helpers/HelperFunctions');
const AIRegistry = require('./AIRegistry');

/**
* Creates an instance of the AI connector for the specified AI
* This function retrieves the AI class and API key requirement from the AIRegistry,
* validates the API key if needed, and returns a new instance of the AI class.
*
* @function createAIInstance
* @param {string} ai - The name of the AI to use (e.g. TensorFlowNode, ChatGPT, DALLE, or Cohere)
* @param {string} [apiKey=null] - The API key required for some AIs. It can be null if the AI does not need an API key
* @returns {object} An instance of the AI connector
* @throws {AIConnectifyError} Throws an error if the API key is required but not provided
*/
function createAIInstance(ai, apiKey = null) { 
    // Get the AI object class/config from the registry
    const instanceAIRegistry = new AIRegistry();
    const AIConstructor = instanceAIRegistry.getAI(ai);
    
    // Check if API key is required and validate it
    if(AIConstructor.apiKeyRequired){
        HelperFunctions.validateKeyString(apiKey, `API key is required for ${ai} service`);
    }

    // Return a new AI instance, passing the API key (if applicable) to the AI class constructor
    return new AIConstructor.aiInstance(apiKey);
}

module.exports = { createAIInstance };