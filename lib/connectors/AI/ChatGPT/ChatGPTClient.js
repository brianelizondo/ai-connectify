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
const { generateRandomID } = require('../../../helpers/generateId');
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
        this.httpRequest = this.createHttpClient();
    }


    /** 
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(){
        return new HttpClient('https://api.openai.com/v1', { 
            Authorization: `Bearer ${this.aiApiKey}`, 
            ...this.organizationIDs 
        });
    }
    /** 
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    */
    setOrganizationId(organizationID){
        ValidationHelpers.validateKeyString(organizationID, `A valid Organization ID must be provided`);
        this.organizationIDs['OpenAI-Organization'] = organizationID;
        this.httpRequest = this.createHttpClient();
    }
    /** 
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The project ID for OpenAI instance
    */
    setProjectId(projectID){
        ValidationHelpers.validateKeyString(projectID, `A valid Project ID must be provided`);
        this.organizationIDs['OpenAI-Project'] = projectID;
        this.httpRequest = this.createHttpClient();
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


    /** MODELS METHODS
    /**
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
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
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The ID of the model to use for this request
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
    
    /**
    * Delete a fine-tuned model. You must have the Owner role in your organization to delete a model
    * @async
    * @param {string} modelID - The ID of the model to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async deleteFineTunedModel(modelID) {
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.delete(`/models/${modelID}`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** CHAT METHODS **/
    /**
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} [modelID="gpt-3.5-turbo"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createChatCompletion(messagesArray, modelID, newConfig) {
        ValidationHelpers.validateArrayInput(messagesArray, 'Cannot process the messages array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/chat/completions', { ...newConfig, messages: messagesArray, model: modelID });
            delete response.usage;
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** EMBEDDINGS METHODS **/
    /**
    * Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms
    * @async
    * @param {string|Array} input - Input text to embed, encoded as a string or array of tokens
    * @param {string} [modelID="text-embedding-ada-002"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createEmbeddings(input, modelID, newConfig) {
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/embeddings', { ...newConfig, input, model: modelID });
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** MODERATIONS METHODS **/
    /**
    * Given some input text, outputs if the model classifies it as potentially harmful across several categories
    * @async
    * @param {string} input - The input text to classify
    * @param {string} [modelID="text-moderation-latest"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createModeration(input, modelID) {
        ValidationHelpers.validateStringInput(input, 'Cannot process the input text');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/moderations', { input, model: modelID });
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }


    /** AUDIO METHODS **/
    /** 
    * Generates audio from the input text
    * @async
    * @param {string} input - The text to generate audio for
    * @param {string} destinationFolder - Folder path to save the file generated
    * @param {string} [modelID="tts-1"] - (Optional) The ID of the model to use
    * @param {string} [response_format="mp3"] - (Optional) The format to audio in
    * @param {string} [voice="alloy"] - (Optional) The voice to use when generating the audio
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createSpeech(input, destinationFolder, modelID, response_format, voice, newConfig) {
        ValidationHelpers.validateStringInput(input, 'Cannot process the input text');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destination folder');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        ValidationHelpers.validateStringInput(response_format, 'Cannot process the response format');
        
        try {
            const formData = new FormData();
            formData.append('input', input);
            formData.append('model', modelID);
            formData.append('response_format', response_format);
            formData.append('voice', voice);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/audio/speech', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    "Content-Type": "multipart/form-data"
                }
            });

            const randomFileName = generateRandomID();
            const urlAudio = `${destinationFolder}/${randomFileName}.${response_format}`;
            fs.writeFileSync(urlAudio, Buffer.from(response));
            
            return { audio_path: urlAudio };
        } catch (error) {
            this.throwError(error);
        }
    }

    /**
    * Transcribes audio into the input language
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<String>} - A Promise that resolves the generated request
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
    * Translates audio into English
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<String>} - A Promise that resolves the generated request
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


    /** FINE-TUNING METHODS **/
    /** 
    * Get info about a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJob(fine_tuning_job_id){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}`);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * List your organization's fine-tuning jobs
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJobs(newConfig){
        try {
            const response = await this.httpRequest.get('/fine_tuning/jobs', newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Get status updates for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningEvents(fine_tuning_job_id, newConfig){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}/events`, newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * List checkpoints for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get checkpoints for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningCheckpoints(fine_tuning_job_id, newConfig){
        ValidationHelpers.validateKeyString(fine_tuning_job_id, 'Cannot process the fine-tuning job ID');

        try {
            const response = await this.httpRequest.get(`/fine_tuning/jobs/${fine_tuning_job_id}/checkpoints`, newConfig);
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Creates a fine-tuning job which begins the process of creating a new model from a given dataset
    * @async
    * @param {string} training_file_id - The ID of an uploaded file that contains training data
    * @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createFineTuning(training_file_id, modelID, newConfig) {
        ValidationHelpers.validateStringInput(training_file_id, 'Cannot process the training file ID');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.httpRequest.post('/fine_tuning/jobs', { ...newConfig, training_file: training_file_id, model: modelID });
            return response;
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Immediately cancel a fine-tune job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
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