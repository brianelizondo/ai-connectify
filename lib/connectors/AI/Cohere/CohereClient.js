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
}

module.exports = CohereClient;