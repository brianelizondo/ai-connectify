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
const ChatGPTClient = require('./ChatGPTClient');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a ChatGPT AI instance
* Handles interaction with the OpenAI API for chat, completions, edits, and model information
* @class ChatGPT
*/
class ChatGPT {
    /**
    * Create a ChatGPT instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'API key is required for initializing ChatGPT instance');
        
        // Initialize ChatGPTClient with API key
        this.client = new ChatGPTClient(apiKey);
    }


    /** 
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setOrganizationId(organizationID){
        this.client.setOrganizationId(organizationID);
    }
    /** 
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The Project ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setProjectId(projectID){
        this.client.setProjectId(projectID);
    }


    /** MODELS METHODS **/
    /**
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(){
        return this.client.getModels();
    }

    /**
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The ID of the model to use for this request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModel(modelID) {
        return this.client.getModel(modelID);
    }

    /**
    * Delete a fine-tuned model. You must have the Owner role in your organization to delete a model
    * @async
    * @param {string} modelID - The ID of the model to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async delFineTunedModel(modelID) {
        return this.client.delFineTunedModel(modelID);
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
    async createChatCompletion(messagesArray, modelID="gpt-3.5-turbo", newConfig={}) {
        return this.client.createChatCompletion(messagesArray, modelID, newConfig);
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
    async createEmbeddings(input, modelID="text-embedding-ada-002", newConfig={}) {
        return this.client.createEmbeddings(input, modelID, newConfig);
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
    async createModeration(input, modelID="text-moderation-latest") {
        return this.client.createModeration(input, modelID);
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
    async createSpeech(input, destinationFolder, modelID="tts-1", response_format="mp3", voice="alloy", newConfig={}) {
        return this.client.createSpeech(input, destinationFolder, modelID, response_format, voice, newConfig);
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
    async createTranscription(filePath, modelID="whisper-1", newConfig={}) {
        return this.client.createTranscription(filePath, modelID, newConfig);
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
    async createTranslation(filePath, modelID="whisper-1", newConfig={}) {
        return this.client.createTranslation(filePath, modelID, newConfig);
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
        return this.client.getFineTuningJob(fine_tuning_job_id);
    }

    /**
    * List your organization's fine-tuning jobs
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJobs(newConfig={}){
        return this.client.getFineTuningJobs(newConfig);
    }

    /**
    * Get status updates for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningEvents(fine_tuning_job_id, newConfig={}){
        return this.client.getFineTuningEvents(fine_tuning_job_id, newConfig);
    }

    /**
    * List checkpoints for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get checkpoints for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningCheckpoints(fine_tuning_job_id, newConfig={}){
        return this.client.getFineTuningCheckpoints(fine_tuning_job_id, newConfig);
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
    async createFineTuning(training_file_id, modelID="gpt-4o-mini", newConfig={}) {
        return this.client.createFineTuning(training_file_id, modelID, newConfig);
    }

    /**
    * Immediately cancel a fine-tune job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async cancelFineTuning(fine_tuning_job_id){
        return this.client.cancelFineTuning(fine_tuning_job_id);
    }
}

module.exports = ChatGPT;