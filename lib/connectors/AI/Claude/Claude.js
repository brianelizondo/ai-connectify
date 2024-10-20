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

    /** 
    * Set the anthropic-version request header
    * @param {string} version - The anthropic-version request header
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setAnthropicVersion(version){
        this.client.setAnthropicVersion(version);
    }


    /** MESSAGE METHODS **/
    /**
    * Send a structured list of input messages with text
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
    * @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createMessage(messagesArray, modelID="claude-3-5-sonnet-20240620", maxTokens=1024, newConfig={}) {
        return this.client.createMessage(messagesArray, modelID, maxTokens, newConfig);
    }

    /**
    * Send a structured list of input messages with text (Streaming)
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
    * @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createMessageStream(messagesArray, modelID="claude-3-5-sonnet-20240620", maxTokens=1024, newConfig={}) {
        return this.client.createMessageStream(messagesArray, modelID, maxTokens, newConfig);
    }


    /** MESSAGE BATCH METHODS **/
    /**
    * (Beta) The Message Batches API can be used to process multiple Messages API requests at once
    * @async
    * @param {Array} requests - List of requests for prompt completion. Each is an individual request to create a Message
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createMessageBatch(requests) {
        return this.client.createMessageBatch(requests);
    }

    /**
    * (Beta) This endpoint is idempotent and can be used to poll for Message Batch completion
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getMessageBatch(messageBatchID) {
        return this.client.getMessageBatch(messageBatchID);
    }

    /**
    * (Beta) Streams the results of a Message Batch as a .jsonl file
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getMessageBatchResults(messageBatchID) {
        return this.client.getMessageBatchResults(messageBatchID);
    }

    /**
    * (Beta) List all Message Batches within a Workspace
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getMessageBatchList(newConfig={}) {
        return this.client.getMessageBatchList(newConfig);
    }

    /**
    * (Beta) Batches may be canceled any time before processing ends
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async cancelMessageBatch(messageBatchID) {
        return this.client.cancelMessageBatch(messageBatchID);
    }
}

module.exports = Claude;