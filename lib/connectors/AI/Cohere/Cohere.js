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
const HelperFunctions = require('../../../helpers/HelperFunctions');

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
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing Cohere instance');
        
        // Initialize CohereClient with API key
        this.client = new CohereClient(apiKey);
    }


    /** 
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        HelperFunctions.validateStringInput(clientName, `A valid client name must be provided`);
        this.client.setClientName(clientName);
    }

    
    /** CHAT METHODS **/
    /**
    * Generates a text response to a user message
    * @async
    * @param {Array} messages - Array of text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async chat(messages, modelID="command-r-plus-08-2024", newConfig={}) {
        return this.client.chat(messages, modelID, newConfig);
    }

    /**
    * Generates a text response to a user message with streaming (stream of events)
    * @async
    * @param {Array} messages - Array of text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async chatWithStreaming(messages, modelID="command-r-plus-08-2024", newConfig={}) {
        return this.client.chatWithStreaming(messages, modelID, newConfig);
    }


    /** EMBED METHODS **/
    /**
    * Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
    * @async
    * @param {string} texts - An array of strings for the model to embed
    * @param {string} [modelID="embed-english-v2.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async embed(texts, modelID="embed-english-v2.0", newConfig={}) {
        return this.client.embed(texts, modelID, newConfig);
    }

    /**
    * Generates a list embed job endpoint allows users to view all embed jobs history for that specific user
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getEmbedJobs() {
        return this.client.getEmbedJobs();
    }

    /**
    * Retrieves the details about an embed job started by the same user
    * @async
    * @param {string} embed_job_id - The ID of the embed job to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getEmbedJob(embed_job_id) {
        return this.client.getEmbedJob(embed_job_id);
    }

    /**
    * Launches an async Embed job for a Dataset of type embed-input
    * @async
    * @param {string} dataset_id - ID of a Dataset. The Dataset must be of type embed-input
    * @param {string} [modelID="embed-english-light-v3.0"] - (Optional) The ID of the model to use
    * @param {string} [input_type="classification"] - (Optional) Specifies the type of input passed to the model
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createEmbedJob(dataset_id, modelID="embed-english-light-v3.0", input_type="classification", newConfig={}) {
        return this.client.createEmbedJob(dataset_id, modelID, input_type, newConfig);
    }

    /**
    * Allows to cancel an active embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async cancelEmbedJob(embed_job_id) {
        return this.client.cancelEmbedJob(embed_job_id);
    }


    /** RERANK METHODS **/
    /**
    * Takes in a query and a list of texts and produces an ordered array with each text assigned a relevance score
    * @async
    * @param {string} query - The search query
    * @param {Array} documents - Array of document objects or strings to rerank
    * @param {string} [modelID="rerank-english-v3.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async rerank(query, documents, modelID="rerank-english-v3.0", newConfig={}) {
        return this.client.rerank(query, documents, modelID, newConfig);
    }


    /** CLASSIFY METHODS
    *
    * classify
    * Makes a prediction about which label fits the specified text inputs best
    * @async
    * @param {Array} inputs - A list of up to 96 texts to be classified
    * @param {Array} [examples=[]] - (Optional) An array of examples to provide context to the model. Each example is a text string and its associated label/class
    * @param {string} [modelID="embed-english-light-v2.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async classify(inputs, examples=[], modelID="embed-english-light-v2.0", newConfig={}) {
        return this.client.classify(inputs, examples, modelID, newConfig);
    }


    /** DATASETS METHODS **/
    /** 
    * Generates a list datasets that have been created
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDatasets(newConfig={}) {
        return this.client.getDatasets(newConfig);
    }

    /**
    * Retrieve a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDataset(dataset_id) {
        return this.client.getDataset(dataset_id);
    }

    /**
    * Retrieves the dataset storage usage for your Organization
    * @async
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDatasetUsage() {
        return this.client.getDatasetUsage();
    }

    /**
    * Create a dataset by uploading a file
    * @async
    * @param {string} name - The name of the uploaded dataset
    * @param {string} filePath - File to create the dataset
    * @param {string} [type="embed-input"] - (Optional) The dataset type, which is used to validate the data
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createDataset(name, filePath, type="embed-input", newConfig={}) {
        return this.client.createDataset(name, filePath, type, newConfig);
    }

    /**
    * Delete a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteDataset(dataset_id) {
        return this.client.deleteDataset(dataset_id);
    }


    /** TOKEN METHODS **/
    /**
    * Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE)
    * @async
    * @param {string} text The string to be tokenized
    * @param {string} [modelID="command"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async tokenize(text, modelID="command") {
        return this.client.tokenize(text, modelID);
    }

    /**
    * Takes tokens using byte-pair encoding and returns their text representation
    * @async
    * @param {Array} tokens The string to be tokenized
    * @param {string} [modelID="command"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async detokenize(tokens, modelID="command") {
        return this.client.detokenize(tokens, modelID);
    }


    /** MODELS METHODS **/
    /** 
    * List of models available for use. The list contains models from Cohere as well as your fine-tuned models
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(newConfig={}){
        return this.client.getModels(newConfig);
    }

    /**
    * Returns the details of a model, provided its name
    * @async
    * @param {string} modelID - The ID of the model to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModel(modelID) {
        return this.client.getModel(modelID);
    }


    /** CONNECTORS METHODS **/
    /**
    * Returns a list of connectors ordered by descending creation date (newer first)
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getConnectors(newConfig={}) {
        return this.client.getConnectors(newConfig);
    }

    /**
    * Retrieve a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getConnector(connector_id) {
        return this.client.getConnector(connector_id);
    }

    /**
    * Creates a new connector
    * @async
    * @param {string} name - A human-readable name for the connector
    * @param {string} url - The URL of the connector that will be used to search for documents
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createConnector(name, url, newConfig={}) {
        return this.client.createConnector(name, url, newConfig);
    }

    /**
    * Update a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to update
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async updateConnector(connector_id, newConfig={}) {
        return this.client.updateConnector(connector_id, newConfig);
    }

    /**
    * Delete a connector by ID
    * @async
    * @param {string} connector_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteConnector(connector_id) {
        return this.client.deleteConnector(connector_id);
    }


    /** FINE-TUNING METHODS **/
    /**
    * Returns a list of fine-tuned models available for use
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedModels(newConfig={}) {
        return this.client.getFineTunedModels(newConfig);
    }

    /**
    * Retrieve a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The fine-tuned model ID
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedModel(finetuned_model_id) {
        return this.client.getFineTunedModel(finetuned_model_id);
    }

    /**
    * Retrieves the chronology of statuses the fine-tuned model has been through
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedChronology(finetuned_model_id, newConfig={}) {
        return this.client.getFineTunedChronology(finetuned_model_id, newConfig);
    }

    /**
    * Retrieves metrics measured during the training of a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedMetrics(finetuned_model_id, newConfig={}) {
        return this.client.getFineTunedMetrics(finetuned_model_id, newConfig);
    }

    /**
    * Trains and deploys a fine-tuned model
    * @async
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createFineTunedModel(name, settings, newConfig={}) {
        return this.client.createFineTunedModel(name, settings, newConfig);
    }

    /**
    * Updates a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async updateFineTunedModel(finetuned_model_id, name, settings, newConfig={}) {
        return this.client.updateFineTunedModel(finetuned_model_id, name, settings, newConfig);
    }

    /**
    * Delete a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteFineTunedModel(finetuned_model_id) {
        return this.client.deleteFineTunedModel(finetuned_model_id);
    }    
}

module.exports = Cohere;