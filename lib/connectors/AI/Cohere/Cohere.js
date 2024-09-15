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


    /** CHECK API KEY METHOD
    *
    * checkApiKey
    * Checks that the api key in the Authorization header is valid and active
    * @async
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async checkApiKey() {
        return this.client.checkApiKey();
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


    /** DATASETS METHODS
    *
    * getDatasets
    * Generates a list datasets that have been created
    * @async
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getDatasets(newConfig={}) {
        return this.client.getDatasets(newConfig);
    }
    /**
    * getDataset
    * Retrieves the details about an embed job
    * @async
    * @param {string} dataset_id - The ID of the dataset to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getDataset(dataset_id) {
        return this.client.getDataset(dataset_id);
    }
    /**
    * getDatasetUsage
    * Retrieves the details about an embed job
    * @async
    * @returns {Promise<Number>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getDatasetUsage() {
        return this.client.getDatasetUsage();
    }
    /**
    * createDataset
    * Create a dataset by uploading a file
    * @async
    * @param {string} name - The name of the uploaded dataset
    * @param {string} [type="embed-input"] - The dataset type, which is used to validate the data
    * @param {string} filePath - File to create the dataset
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<string>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createDataset(name, filePath, type="embed-input", newConfig={}) {
        return this.client.createDataset(name, filePath, type, newConfig);
    }
    /**
    * deleteDataset
    * Delete a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async deleteDataset(dataset_id) {
        return this.client.deleteDataset(dataset_id);
    }


    /** TOKEN METHODS
    *
    * tokenize
    * Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE)
    * @async
    * @param {string} text The string to be tokenized
    * @param {string} [modelID="command"] - The Cohere model ID to use
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async tokenize(text, modelID="command") {
        return this.client.tokenize(text, modelID);
    }
    /**
    * detokenize
    * Takes tokens using byte-pair encoding and returns their text representation
    * @async
    * @param {Array} tokens The string to be tokenized
    * @param {string} [modelID="command"] - The Cohere model ID to use
    * @returns {Promise<string>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async detokenize(tokens, modelID="command") {
        return this.client.detokenize(text, modelID);
    }


    /** MODELS METHODS
    *
    * getModels
    * List of models available for use. The list contains models from Cohere as well as your fine-tuned models
    * @async
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(newConfig={}){
        return this.client.getModels(newConfig);
    }
    /**
    * getModel
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The ID of the model to retrieve
    * @returns {Promise<Object>} - A Promise that resolves with the model's details
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModel(modelID) {
        return this.client.getModel(modelID);
    }


    /** CONNECTORS METHODS
    *
    * getConnectors
    * Returns a list of connectors ordered by descending creation date (newer first)
    * @async
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getConnectors(newConfig={}) {
        return this.client.getConnectors(newConfig);
    }
    /**
    * getConnector
    * Retrieve a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getConnector(connector_id) {
        return this.client.getConnector(connector_id);
    }
    /**
    * createConnector
    * Creates a new connector
    * @async
    * @param {string} name - A human-readable name for the connector
    * @param {string} url - The URL of the connector that will be used to search for documents
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createConnector(name, url, newConfig={}) {
        return this.client.createConnector(name, url, newConfig);
    }
    /**
    * updateConnector
    * Update a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to update
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async updateConnector(connector_id, newConfig={}) {
        return this.client.updateConnector(connector_id, newConfig);
    }
    /**
    * deleteConnector
    * Delete a connector by ID
    * @async
    * @param {string} connector_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async deleteConnector(connector_id) {
        return this.client.deleteConnector(connector_id);
    }


    /** FINE-TUNING METHODS
    *
    * getFineTunedModels
    * Returns a list of fine-tuned models available for use
    * @async
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getFineTunedModels(newConfig={}) {
        return this.client.getFineTunedModels(newConfig);
    }
    /**
    * getFineTunedModel
    * Retrieve a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getFineTunedModel(finetuned_model_id) {
        return this.client.getFineTunedModel(finetuned_model_id);
    }
    /**
    * getChronology
    * Retrieves the chronology of statuses the fine-tuned model has been through
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model to retrieve.
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getChronology(finetuned_model_id, newConfig={}) {
        return this.client.getChronology(finetuned_model_id, newConfig);
    }
    /**
    * getMetrics
    * Retrieves metrics measured during the training of a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model to retrieve.
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getMetrics(finetuned_model_id, newConfig={}) {
        return this.client.getMetrics(finetuned_model_id, newConfig);
    }
    /**
    * createFineTunedModel
    * Trains and deploys a fine-tuned model
    * @async
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createFineTunedModel(name, settings, newConfig={}) {
        return this.client.createFineTunedModel(name, settings, newConfig);
    }
    /**
    * updateFineTunedModel
    * Updates a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model to retrieve.
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async updateFineTunedModel(finetuned_model_id, name, settings, newConfig={}) {
        return this.client.updateFineTunedModel(finetuned_model_id, name, settings, newConfig);
    }
    /**
    * deleteFineTunedModel
    * Delete a fine-tuned by ID
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model to delete.
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async deleteFineTunedModel(finetuned_model_id) {
        return this.client.deleteFineTunedModel(finetuned_model_id);
    }    
}

module.exports = Cohere;