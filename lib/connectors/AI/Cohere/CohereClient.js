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
        this.httpRequest = new HttpClient('https://api.cohere.com/v1', { Authorization: `Bearer ${apiKey}` });
    }

    /** 
    * setClientName
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName){
        this.httpRequest = new HttpClient('https://api.cohere.com/v1', { Authorization: `Bearer ${this.aiApiKey}`, 'X-Client-Name': clientName });
    }
    /**
    * throwError
    * Throw a formatted AIConnectifyError with the AI service and error message.
    * @param {Object} error - The error object caught during the request.
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description.
    */
    throwError(error){
        const errorMsg = error.response ? error.response.data.error.message : error.message;
        throw new AIConnectifyError(`${this.aiName} error => ${errorMsg}`);
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
    async chat(message, modelID, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(message, 'Cannot process the message input');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat', { ...newConfig, message, stream: false, model: modelID });
            return {
                response_id: response.response_id,
                text: response.text,
                generation_id: response.generation_id,
                chat_history: response.chat_history
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async chatWithStreaming(message, modelID, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(message, 'Cannot process the message input');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat', { ...newConfig, message, stream: true, model: modelID });
            const linesFromResponse = response.split('\n');
            const objectsFromResponse = linesFromResponse.map(line => JSON.parse(line));            
            return objectsFromResponse;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** EMBED METHODS
    *
    * embed
    * Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
    * @async
    * @param {string} texts - An array of strings for the model to embed
    * @param {string} [modelID="embed-english-v2.0"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async embed(texts, modelID, newConfig={}) {
        // Inputs validations
        ValidationHelpers.validateArrayInput(texts, 'Cannot process an empty texts array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/embed', { ...newConfig, texts, model: modelID });
            return response.embeddings;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * getEmbedJobs
    * Generates a list of all embed jobs history
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
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
    * getEmbedJob
    * Retrieves the details about an embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to retrieve.
    * @returns {Promise<Array>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getEmbedJob(embed_job_id) {
        // Inputs validations
        ValidationHelpers.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
        try {
            const response = await this.httpRequest.get(`/embed-jobs/${embed_job_id}`);
            return {
                job_id: response.job_id,
                status: response.status,
                created_at: response.created_at,
                input_dataset_id: response.input_dataset_id,
                model: response.model,
                truncate: response.truncate,
                name: response.name,
                output_dataset_id: response.output_dataset_id,
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async createEmbedJob(modelID, dataset_id, input_type, newConfig) {
       // Inputs validations
       ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
       ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset ID');
       ValidationHelpers.validateStringInput(input_type, 'Cannot process the input type');
       
       try {
           const response = await this.httpRequest.post('/embed-jobs', { ...newConfig, model: modelID, dataset_id, input_type });
           return response.job_id;
       } catch (error) {
           this.throwError(error);
       }
    }
    /**
    * cancelEmbedJob
    * Allows to cancel an active embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to cancel.
    * @returns {Promise<string>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async cancelEmbedJob(embed_job_id) {
        // Inputs validations
        ValidationHelpers.validateStringInput(embed_job_id, 'Cannot process the embed job ID');
        
        try {
            const response = await this.httpRequest.post(`/embed-jobs/${embed_job_id}/cancel`);
            return {
                job_id: embed_job_id,
                status: "canceled"
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async rerannk(query, documments, modelID, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(query, 'Cannot process the message input');
        ValidationHelpers.validateArrayInput(documments, 'Cannot process an empty documments array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/rerank', { ...newConfig, query, documments, model: modelID });
            return {
                id: response.id,
                results: response.results
            };
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
    * @param {Array} examples - An array of examples to provide context to the model. Each example is a text string and its associated label/class
    * @param {string} [modelID="embed-english-light-v2.0"] - The Cohere model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async classify(inputs, examples, modelID, newConfig) {
        // Inputs validations
        ValidationHelpers.validateArrayInput(inputs, 'Cannot process an empty imputs array');
        if(examples.length > 0){
            ValidationHelpers.validateArrayInput(examples, 'Cannot process an empty examples array');
        } 
        
        try {
            const response = await this.httpRequest.post('/classify', { ...newConfig, inputs, examples, model: modelID });
            return {
                id: response.id,
                classifications: response.classifications
            };
        } catch (error) {
            this.throwError(error);
        }
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
    async getDatasets(newConfig) {
        try {
            const response = await this.httpRequest.get('/datasets', newConfig);
            return response.datasets;
        } catch (error) {
            this.throwError(error);
        }
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
        // Inputs validations
        ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset input');

        try {
            const response = await this.httpRequest.get(`/datasets/${dataset_id}`);
            return response.dataset;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * getDatasetUsage
    * Retrieves the details about an embed job
    * @async
    * @returns {Promise<Number>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async getDatasetUsage() {
        try {
            const response = await this.httpRequest.get('/datasets/usage');
            return response.organization_usage;
        } catch (error) {
            this.throwError(error);
        }
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
    async createDataset(name, filePath, type, newConfig) {
        // Inputs validations
        ValidationHelpers.validateStringInput(name, 'Cannot process the name input');
        ValidationHelpers.validateStringInput(type, 'Cannot process the type input');
        ValidationHelpers.validateStringInput(filePath, 'Cannot process the filePath input');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            formData.append('file', fileStream);
            formData.append('name', name);
            formData.append('type', type);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/datasets', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.id;
        } catch (error) {
            this.throwError(error);
        }
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
        // Inputs validations
        ValidationHelpers.validateStringInput(dataset_id, 'Cannot process the dataset input');

        try {
            const response = await this.httpRequest.delete(`/datasets/${dataset_id}`);
            return {
                dataset_id,
                status: "deleted"
            };
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = CohereClient;