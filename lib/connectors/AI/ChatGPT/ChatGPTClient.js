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
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the ChatGPT API
* @class ChatGPTClient
*/
class ChatGPTClient {
    /**
    * Create a ChatGPT service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'ChatGPT';
        this.aiApiKey = apiKey;
        this.organizationIDs = {};
        this.createHttpClient();
    }


    /** 
    * createHttpClient
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(){
        this.httpRequest = new HttpClient('https://api.openai.com/v1', { Authorization: `Bearer ${this.aiApiKey}`, ...this.organizationIDs });
    }
    /** 
    * setOrganizationId
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    */
    setOrganizationId(organizationID){
        // organizationID validation
        ValidationHelpers.validateKeyString(organizationID, `A valid Organization ID must be provided`);

        this.organizationIDs['OpenAI-Organization'] = organizationID;
        this.createHttpClient();
    }
    /** 
    * setProjectId
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The project ID for OpenAI instance
    */
    setProjectId(projectID){
        // projectID validation
        ValidationHelpers.validateKeyString(projectID, `A valid Project ID must be provided`);

        this.organizationIDs['OpenAI-Project'] = projectID;
        this.createHttpClient();
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


    /** MODELS METHODS
    *
    * getModels
    * Retrieve available models from OpenAI
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the API call
    */
    async getModels(){
        try {
            const response = await this.httpRequest.get('/models');
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * getModel
    * Retrieve specific model details from OpenAI
    * @async
    * @param {string} model - The model ID to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the model's information
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the API call
    */
    async getModel(modelID) {
        // modelID validation
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.get(`/models/${modelID}`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * delFineTunedModel
    * Delete a fine-tuned model from OpenAI
    * @async
    * @param {string} modelID - The model ID to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the model's information deleted
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the API call
    */
    async delFineTunedModel(modelID) {
        // modelID validation
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.delete(`/models/${modelID}`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** CHAT METHODS
    *
    * createChatCompletion
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createChatCompletion(messagesArray, modelID, newConfig) {
        // Inputs validations
        ValidationHelpers.validateArrayInput(messagesArray, 'Cannot process an empty messages array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat/completations', { messages: messagesArray, model: modelID, ...newConfig });
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** EMBEDDINGS METHODS
    *
    * createEmbeddings
    * Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms
    * @async
    * @param {string|Array} input - A list of messages describing the conversation so far
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createEmbeddings(input, modelID, newConfig) {
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/embeddings', { input, model: modelID, ...newConfig });
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** MODERATIONS METHODS
    *
    * createModeration
    * Given some input text, outputs if the model classifies it as potentially harmful across several categories
    * @async
    * @param {string} input - A list of messages describing the conversation so far
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createModeration(input, modelID) {
        ValidationHelpers.validateStringInput(input, 'Cannot process the input text');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/moderations', { input, model: modelID });
            return response.results;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** AUDIO METHODS
    *
    * createSpeech
    * Generates audio from the input text.
    * @async
    * @param {string} input - The input text to classify
    * @param {string} [modelID="tts-1"] - The OpenAI GPT model ID to use
    * @param {string} [voice="alloy"] - The voice to use when generating the audio
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createSpeech(input, modelID, voice, newConfig) {
        ValidationHelpers.validateStringInput(input, 'Cannot process the input text');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/audio/speech', { input, model: modelID, voice, ...newConfig });
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * createTranscription
    * Transcribes audio into the input language.
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<String>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createTranscription(filePath, modelID, newConfig) {
        ValidationHelpers.validateStringInput(filePath, 'Cannot process the file path');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            formData.append('file', fileStream);
            formData.append('model', modelID);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/audio/transcriptions', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.text;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * createTranslation
    * Translates audio into English.
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<String>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createTranslation(filePath, modelID, newConfig) {
        ValidationHelpers.validateStringInput(filePath, 'Cannot process the file path');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            formData.append('file', fileStream);
            formData.append('model', modelID);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/audio/translations', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.text;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** FINE-TUNING METHODS
    * getFineTuningJob
    * Get info about a fine-tuning job
    * @async
    * @returns {Promise<Object>} - A Promise that resolves with the info about a fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJob(fine_tuning_job_id){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}`, newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    *
    * getFineTuningJobs
    * List your organization's fine-tuning jobs
    * @async
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the organization's fine-tuning jobs
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJobs(newConfig){
        try {
            const response = await this.httpRequest.get('/fine_tuning/jobs', newConfig);
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    *
    * getFineTuningEvents
    * Get status updates for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the list of status updates for a fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningEvents(fine_tuning_job_id, newConfig){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, newConfig);
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    *
    * getFineTuningCheckpoints
    * List checkpoints for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the list of checkpoints for a fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningCheckpoints(fine_tuning_job_id, newConfig){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}/checkpoints`, newConfig);
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * 
    * createFineTuning
    * Creates a fine-tuning job which begins the process of creating a new model from a given dataset
    * @async
    * @param {string} trainingFilePath - The training file object (path - not file name) that contains training data
    * @param {string} [modelID="gpt-4o-mini"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createFineTuning(trainingFilePath, modelID, newConfig) {
        ValidationHelpers.validateStringInput(trainingFilePath, 'Cannot process the training file path');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(trainingFilePath);
            formData.append('file', fileStream);
            formData.append('model', modelID);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/fine_tuning/jobs', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * 
    * cancelFineTuning
    * Immediately cancel a fine-tune job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @returns {Promise<Object>} - A Promise that resolves with the info about a cancel fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async cancelFineTuning(fine_tuning_job_id){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.post(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = ChatGPTClient;