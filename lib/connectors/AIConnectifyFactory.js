/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
const AIConnectifyError = require('../AIConnectifyError');
const TensorFlowNode = require('./AI/TensorFlowNode');
const ChatGPT = require('./AI/ChatGPT');
const DALLE = require('./AI/DALLE');
const Cohere = require('./AI/Cohere');

/**
* @module AIConnectifyFactory 
* Returns an instance of the AI connector for the specified AI
*
* @function
* @param {string} ai The name of the AI to use (e.g. 'TensorFlowNode', 'ChatGPT', 'DALLE')
* @param {string} apiKey The API key required for some AI (e.g. 'ChatGPT', 'DALLE', 'Cohere')
* @returns {object} An instance of the AI connector
* @throws {AIConnectifyError} Throws an error if an unsupported AI is specified or API key is required but not provided
*/
function getAIInstance(ai, apiKey) { 
    switch (ai) {
        case 'TensorFlowNode':
            const tfn = new TensorFlowNode();
            return tfn.tf;
        case 'ChatGPT':
            if (!apiKey) {
                throw new AIConnectifyError('API key is required for ChatGPT');
            }
            return new ChatGPT(apiKey);
        case 'DALLE':
            if (!apiKey) {
                throw new AIConnectifyError('API key is required for DALL-E');
            }
            return new DALLE(apiKey);
        case 'Cohere':
            if (!apiKey) {
                throw new AIConnectifyError('API key is required for Cohere');
            }
            return new Cohere(apiKey);
        default:
            throw new AIConnectifyError('You must specify an AI to use');
    }
}

module.exports = getAIInstance;