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
const CohereClient = require('./CohereClient');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a Cohere AI instance
* Given a prompt, the model   builds natural language processing and generation
* @class Cohere
*/
class Cohere {
    /**
    * Create a Cohere instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere API
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize CohereClient with API key
        this.client = new CohereClient(apiKey);
    }

    
    /** 
    * setClientName
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        ValidationHelpers.validateStringInput(clientName, `A valid client name must be provided`);
        this.client.setClientName(clientName);
    }

    
    /** CHAT METHODS
    *
    * chat
    * Generates a text response to a user message
    * @async
    * @param {string} message - Text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async chat(message, modelID="command-r-plus-08-2024", newConfig={}) {
        return this.client.chat(message, modelID, newConfig);
    }
    /**
    * chatWithStreaming
    * Generates a text response to a user message
    * @async
    * @param {string} message - Text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async chatWithStreaming(message, modelID="command-r-plus-08-2024", newConfig={}) {
        return this.client.chatWithStreaming(message, modelID, newConfig);
    }


    /** EMBED METHODS
    *
    * embed
    * Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
    * @async
    * @param {string} texts - An array of strings for the model to embed
    * @param {string} [modelID="embed-english-v2.0"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async embed(texts, modelID="embed-english-v2.0", newConfig={}) {
        return this.client.embed(texts, modelID, newConfig);
    }
    /**
    * getEmbedJobs
    * Generates a list of all embed jobs history
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getEmbedJobs() {
        return this.client.getEmbedJobs();
    }
    /**
    * getEmbedJob
    * Retrieves the details about an embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to retrieve.
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getEmbedJob(embed_job_id) {
        return this.client.getEmbedJob(embed_job_id);
    }
    /**
    * createEmbedJob
    * Generates an async Embed job for a Dataset of type embed-input
    * @async
    * @param {string} [modelID="embed-english-light-v3.0"] - The Cohere model ID to use
    * @param {string} dataset_id - ID of a Dataset. The Dataset must be of type embed-input
    * @param {string} [input_type="classification"] - Specifies the type of input passed to the model
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<string>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createEmbedJob(modelID="embed-english-light-v3.0", dataset_id, input_type="classification", newConfig={}) {
        return this.client.createEmbedJob(modelID, dataset_id, input_type, newConfig);
    }
    /**
    * getEmbedJobs
    * Generates a list of all embed jobs history
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getEmbedJobs() {
        return this.client.getEmbedJobs();
    }
    /**
    * cancelEmbedJob
    * Allows to cancel an active embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to cancel.
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async cancelEmbedJob(embed_job_id) {
        return this.client.cancelEmbedJob(embed_job_id);
    }


    /** RERANK METHODS
    *
    * rerannk
    * Takes in a query and a list of texts and produces an ordered array with each text assigned a relevance score
    * @async
    * @param {string} query - Query input for the model to respond to
    * @param {Array} documments - Array of document objects or strings to rerank
    * @param {string} [modelID="rerank-english-v3.0"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async rerannk(query, documments, modelID="rerank-english-v3.0", newConfig={}) {
        return this.client.rerannk(query, documments, modelID, newConfig);
    }


    /** CLASSIFY METHODS
    *
    * classify
    * Makes a prediction about which label fits the specified text inputs best
    * @async
    * @param {Array} inputs - A list of up to 96 texts to be classified
    * @param {Array} [examples=[]] - An array of examples to provide context to the model. Each example is a text string and its associated label/class
    * @param {string} [modelID="embed-english-light-v2.0"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async classify(inputs, examples=[], modelID="embed-english-light-v2.0", newConfig={}) {
        return this.client.classify(inputs, examples, modelID, newConfig);
    }
}

module.exports = Cohere;