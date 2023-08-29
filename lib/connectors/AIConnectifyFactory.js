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
const AIConnectifyError = require('../AIConnectifyError');
const ValidationHelpers = require('../helpers/validationHelpers');
// AI services classes
const TensorFlowNode = require('./AI/TensorFlowNode');
const ChatGPT = require('./AI/ChatGPT');
const DALLE = require('./AI/DALLE');
const Cohere = require('./AI/Cohere');

/**
* Returns an instance of the AI connector for the specified AI
* @function getAIInstance
* @param {string} ai The name of the AI to use (e.g. TensorFlowNode, ChatGPT, DALL-E or Cohere)
* @param {string} apiKey The API key required for some AI (e.g. ChatGPT, DALL-E or Cohere)
* @returns {object} An instance of the AI connector
* @throws {AIConnectifyError} Throws an error if an unsupported AI is specified or API key is required but not provided
*/
function getAIInstance(ai, apiKey) { 
    const aiClassInstance = {
        TensorFlowNode: {
            aiInstance: TensorFlowNode,
            apiKeyRequired : false
        },
        ChatGPT: {
            aiInstance: ChatGPT,
            apiKeyRequired : true
        },
        DALLE: {
            aiInstance: DALLE,
            apiKeyRequired : true
        },
        Cohere: {
            aiInstance: Cohere,
            apiKeyRequired : true
        }
    };

    // Get the AI object class/config 
    const AIConstructor = aiClassInstance[ai];
    
    // Check if exist and apiKey is required
    if (!AIConstructor) {
        throw new AIConnectifyError('You must specify a valid AI to use');
    }
    if (AIConstructor.apiKeyRequired){
        ValidationHelpers.validateStringInput(apiKey, `API key is required for ${ai}`);
    }

    // Return a new AI instance
    return new AIConstructor.aiInstance(apiKey);
}

module.exports = getAIInstance;