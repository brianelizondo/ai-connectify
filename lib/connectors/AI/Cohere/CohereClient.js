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
const fs = require('fs');
const FormData = require('form-data');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Cohere API
* @class CohereClient
*/
class CohereClient {
    /**
    * Create a Cohere service instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere
    */
    constructor(apiKey) {
        this.aiName = 'Cohere';
        this.aiApiKey = apiKey;
        this.httpRequest = new HttpClient('https://api.cohere.com/v2', { Authorization: `Bearer ${apiKey}` });
    }

    /** 
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        ValidationHelpers.validateStringInput(clientName, 'Cannot process the client name');
        this.httpRequest = new HttpClient('https://api.cohere.com/v2', { Authorization: `Bearer ${this.aiApiKey}`, 'X-Client-Name': clientName });
    }
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error){
        const errorMsg = error.response ? error.response.data.error.message : error.message;
        throw new AIConnectifyError(`${this.aiName} error => ${errorMsg}`);
    }


    /** CHECK API KEY METHOD **/
    /**
    * Checks that the api key in the Authorization header is valid and active
    * @async
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async checkApiKey() {
        try {
            const response = await this.httpRequest.post('/check-api-key');
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** CHAT METHODS
    /**
    * Generates a text response to a user message
    * @async
    * @param {Array} messages - Array of text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async chat(messages, modelID, newConfig) {
        ValidationHelpers.validateArrayInput(messages, 'Cannot process the message');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat', { ...newConfig, messages, stream: false, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
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
    async chatWithStreaming(messages, modelID, newConfig) {
        ValidationHelpers.validateArrayInput(messages, 'Cannot process the messages');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat', { 
                response_format: { type: 'json_object' },
                ...newConfig, 
                messages, 
                stream: true, 
                model: modelID 
            });
            const linesFromResponse = response.split('\n');
            const objectsFromResponse = linesFromResponse.map(line => JSON.parse(line));            
            return objectsFromResponse;
        } catch (error) {
            this.throwError(error);
        }
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
    async embed(texts, modelID, newConfig={}) {
        ValidationHelpers.validateArrayInput(texts, 'Cannot process the texts array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/embed', { ...newConfig, texts, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }

    /**
    * Generates a list embed job endpoint allows users to view all embed jobs history for that specific user
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getEmbedJobs(){
        try {
            const response = await this.httpRequest.get('/embed-jobs');
            return response.embed_jobs;
        } catch (error) {
            this.throwError(error);
        }
    }

    /**
    * Retrieves the details about an embed job started by the same user
    * @async
    * @param {string} embed_job_id - The ID of the embed job to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getEmbedJob(embed_job_id) {
        ValidationHelpers.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
        try {
            const response = await this.httpRequest.get(`/embed-jobs/${embed_job_id}`);
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
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
    async createEmbedJob(dataset_id, modelID, input_type, newConfig) {
        ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset ID');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        ValidationHelpers.validateStringInput(input_type, 'Cannot process the input type');
       
        try {
            const response = await this.httpRequest.post('/embed-jobs', { ...newConfig, model: modelID, dataset_id, input_type });
            return response.job_id;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Allows to cancel an active embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async cancelEmbedJob(embed_job_id) {
        ValidationHelpers.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
        try {
            await this.httpRequest.post(`/embed-jobs/${embed_job_id}/cancel`);
            return {
                embed_job_id,
                status: "canceled"
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async rerank(query, documents, modelID, newConfig) {
        ValidationHelpers.validateStringInput(query, 'Cannot process the message');
        ValidationHelpers.validateArrayInput(documents, 'Cannot process the documments array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/rerank', { ...newConfig, query, documents, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
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
    async classify(inputs, examples, modelID, newConfig) {
        ValidationHelpers.validateArrayInput(inputs, 'Cannot process the imputs array');
        if(examples.length > 0){
            ValidationHelpers.validateArrayInput(examples, 'Cannot process the examples array');
        } 
        
        try {
            const response = await this.httpRequest.post('/classify', { ...newConfig, inputs, examples, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }

    
    /** DATASETS METHODS **/
    /** 
    * Generates a list datasets that have been created
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDatasets(newConfig) {
        try {
            const response = await this.httpRequest.get('/datasets', newConfig);
            return response.datasets;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieve a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDataset(dataset_id) {
        ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset ID');

        try {
            const response = await this.httpRequest.get(`/datasets/${dataset_id}`);
            return response.dataset;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieves the dataset storage usage for your Organization
    * @async
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getDatasetUsage() {
        try {
            const response = await this.httpRequest.get('/datasets/usage');
            return response;
        } catch (error) {
            this.throwError(error);
        }
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
    async createDataset(name, filePath, type, newConfig) {
        ValidationHelpers.validateStringInput(name, 'Cannot process the name');
        ValidationHelpers.validateStringInput(filePath, 'Cannot process the file path');
        ValidationHelpers.validateStringInput(type, 'Cannot process the type');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            formData.append('data', fileStream);
            formData.append('name', name);
            formData.append('type', type);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/datasets', formData, {
                headers: { ...formData.getHeaders() }
            });
            return {
                dataset_id: response.id
            };
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Delete a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteDataset(dataset_id) {
        ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset ID');

        try {
            await this.httpRequest.delete(`/datasets/${dataset_id}`);
            return {
                dataset_id,
                status: "deleted"
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async tokenize(text, modelID) {
        ValidationHelpers.validateStringInput(text, 'Cannot process the text');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.post('/tokenize', { text, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Takes tokens using byte-pair encoding and returns their text representation
    * @async
    * @param {Array} tokens The string to be tokenized
    * @param {string} [modelID="command"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async detokenize(tokens, modelID) {
        ValidationHelpers.validateArrayInput(tokens, 'Cannot process the tokens array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.post('/detokenize', { tokens, model: modelID });
            delete response.meta;
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** MODELS METHODS **/
    /** 
    * List of models available for use. The list contains models from Cohere as well as your fine-tuned models
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(newConfig){
        try {
            const response = await this.httpRequest.get('/models', newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Returns the details of a model, provided its name
    * @async
    * @param {string} modelID - The ID of the model to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModel(modelID) {
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.get(`/models/${modelID}`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** CONNECTORS METHODS **/
    /**
    * Returns a list of connectors ordered by descending creation date (newer first)
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getConnectors(newConfig) {
        try {
            const response = await this.httpRequest.get('/connectors', newConfig);
            return response.connectors;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieve a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getConnector(connector_id) {
        ValidationHelpers.validateStringInput(connector_id, 'Cannot process the connector ID');

        try {
            const response = await this.httpRequest.get(`/connectors/${connector_id}`);
            return response.connector;
        } catch (error) {
            this.throwError(error);
        }
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
    async createConnector(name, url, newConfig) {
        ValidationHelpers.validateStringInput(name, 'Cannot process the name');
        ValidationHelpers.validateStringInput(url, 'Cannot process the url');

        try {
            const response = await this.httpRequest.post('/connectors', { ...newConfig, name, url });
            return response.connector;
        } catch (error) { 
            this.throwError(error);
        }
    }
    
    /**
    * Update a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to update
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async updateConnector(connector_id, newConfig) {
        ValidationHelpers.validateStringInput(connector_id, 'Cannot process the connector ID');

        try {
            const response = await this.httpRequest.patch(`/connectors/${connector_id}`, newConfig);
            return response.connector;
        } catch (error) { 
            this.throwError(error);
        }
    }
    
    /**
    * Delete a connector by ID
    * @async
    * @param {string} connector_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteConnector(connector_id) {
        ValidationHelpers.validateStringInput(connector_id, 'Cannot process the connector ID');

        try {
            await this.httpRequest.delete(`/connectors/${connector_id}`);
            return {
                connector_id,
                status: "deleted"
            };
        } catch (error) {
            this.throwError(error);
        }
    }


    /** FINE-TUNING METHODS **/
    /**
    * Returns a list of fine-tuned models available for use
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedModels(newConfig) {
        try {
            const response = await this.httpRequest.get('/finetuning/finetuned-models', newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieve a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The fine-tuned model ID
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedModel(finetuned_model_id) {
       ValidationHelpers.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

        try {
            const response = await this.httpRequest.get(`/finetuning/finetuned-models/${finetuned_model_id}`);
            return response.finetuned_model;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieves the chronology of statuses the fine-tuned model has been through
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedChronology(finetuned_model_id, newConfig) {
        ValidationHelpers.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

        try {
            const response = await this.httpRequest.get(`/finetuning/finetuned-models/${finetuned_model_id}/events`, newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Retrieves metrics measured during the training of a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTunedMetrics(finetuned_model_id, newConfig) {
        ValidationHelpers.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

        try {
            const response = await this.httpRequest.get(`/finetuning/finetuned-models/${finetuned_model_id}/training-step-metrics`, newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
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
    async createFineTunedModel(name, settings, newConfig) {
        ValidationHelpers.validateStringInput(name, 'Cannot process the fine-tuned model name');

        try {
            const response = await this.httpRequest.post('/finetuning/finetuned-models', { ...newConfig, name, settings });
            return response.finetuned_model;
        } catch (error) {
            this.throwError(error);
        }
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
    async updateFineTunedModel(finetuned_model_id, name, settings, newConfig) {
        ValidationHelpers.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');
        ValidationHelpers.validateStringInput(name, 'Cannot process the fine-tuned model name');

        try {
            const response = await this.httpRequest.patch(`/finetuning/finetuned-models/${finetuned_model_id}`, { ...newConfig, name, settings });
            return response.finetuned_model;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Delete a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteFineTunedModel(finetuned_model_id) {
        ValidationHelpers.validateStringInput(finetuned_model_id, 'Cannot process the fine-tuned model ID');

        try {
            await this.httpRequest.delete(`/finetuning/finetuned-models/${finetuned_model_id}`);
            return {
                finetuned_model_id,
                status: "deleted"
            };
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = CohereClient;