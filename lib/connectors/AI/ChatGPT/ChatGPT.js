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
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a ChatGPT AI instance.
* Handles interaction with the OpenAI API for chat, completions, edits, and model information.
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
        ValidationHelpers.validateKeyString(apiKey, `A valid API key must be provided`);
        
        // Initialize ChatGPTClient with API key
        this.client = new ChatGPTClient(apiKey);
    }


    /** 
    * setOrganizationId
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setOrganizationId(organizationID){
        ValidationHelpers.validateKeyString(organizationID, `A valid Organization ID must be provided`);
        this.client.setOrganizationId(organizationID);
    }
    /** 
    * setProjectId
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} organizationID - The project ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setProjectId(projectID){
        ValidationHelpers.validateKeyString(projectID, `A valid Organization ID must be provided`);
        this.client.setProjectId(projectID);
    }


    /** MODELS METHODS
    *
    * getModels
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getModels(){
        return this.client.getModels();
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
    /**
    * delFineTunedModel
    * Delete a fine-tuned model from OpenAI
    * @async
    * @param {string} modelID - The ID of the model to delete
    * @returns {Promise<Object>} - A Promise that resolves with the model's deleted
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async delFineTunedModel(modelID) {
        return this.client.delFineTunedModel(modelID);
    }


    /** CHAT METHODS
    *
    * createChatCompletion
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} [modelID="gpt-4o-mini"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createChatCompletion(messagesArray, modelID = "gpt-4o-mini", newConfig = {}) {
        return this.client.createChatCompletion(messagesArray, modelID, newConfig);
    }


    /** EMBEDDINGS METHODS
    *
    * createEmbeddings
    * Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms
    * @async
    * @param {string|Array} input - Input text to embed, encoded as a string or array of tokens
    * @param {string} [modelID="text-embedding-3-small"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createEmbeddings(input, modelID = "text-embedding-3-small", newConfig = {}) {
        return this.client.createEmbeddings(input, modelID, newConfig);
    }


    /** MODERATIONS METHODS
    *
    * createModeration
    * Given some input text, outputs if the model classifies it as potentially harmful across several categories
    * @async
    * @param {string} input - The input text to classify
    * @param {string} [modelID="text-moderation-latest"] - (Optional) The OpenAI GPT model ID to use
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createModeration(input, modelID) {
        return this.client.createModeration(input, modelID = "text-moderation-latest");
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
    async createSpeech(input, modelID, voice, newConfig = {}) {
        return this.client.createSpeech(input, modelID = "tts-1", voice, newConfig);
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
    async createTranscription(filePath, modelID, newConfig = {}) {
        return this.client.createTranscription(filePath, modelID = "whisper-1", newConfig);
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
    async createTranslation(filePath, modelID = "whisper-1", newConfig = {}) {
        return this.client.createTranslation(filePath, modelID, newConfig);
    }


    /** FINE-TUNING METHODS
    *
    * getFineTuningJob
    * Get info about a fine-tuning job
    * @async
    * @returns {Promise<Object>} - A Promise that resolves with the info about a fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJob(fine_tuning_job_id){
        return this.client.getFineTuningJob(fine_tuning_job_id);
    }
    /**
    * getFineTuningJobs
    * List your organization's fine-tuning jobs
    * @async
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the list of organization's fine-tuning jobs
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getFineTuningJobs(newConfig = {}){
        return this.client.getFineTuningJobs(newConfig);
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
    async getFineTuningEvents(fine_tuning_job_id, newConfig = {}){
        return this.client.getFineTuningEvents(fine_tuning_job_id, newConfig);
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
    async getFineTuningCheckpoints(fine_tuning_job_id, newConfig = {}){
        return this.client.getFineTuningCheckpoints(fine_tuning_job_id, newConfig);
    }
    /**
    * createFineTuning
    * Creates a fine-tuning job which begins the process of creating a new model from a given dataset
    * @async
    * @param {string} trainingFilePath - The training file object (path - not file name) that contains training data
    * @param {string} [modelID="gpt-4o-mini"] - The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - Optional parameters for the generation
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createFineTuning(trainingFilePath, modelID = "gpt-4o-mini", newConfig = {}) {
        return this.client.createFineTuning(trainingFilePath, modelID, newConfig);
    }
    /**
    * cancelFineTuning
    * Immediately cancel a fine-tune job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @returns {Promise<Object>} - A Promise that resolves with the info about a fine-tuning job
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async cancelFineTuning(fine_tuning_job_id){
        return this.client.cancelFineTuning(fine_tuning_job_id);
    }
}

module.exports = ChatGPT;