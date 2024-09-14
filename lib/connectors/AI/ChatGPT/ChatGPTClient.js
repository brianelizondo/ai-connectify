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
        this.httpRequest = new HttpClient('https://api.openai.com/v1', { Authorization: `Bearer ${aiApiKey}`, ...this.organizationIDs });
    }
    /** 
    * setOrganizationId
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    */
    setOrganizationId(organizationID){
        this.organizationIDs['OpenAI-Organization'] = organizationID;
        createHttpClient();
    }
    /** 
    * setProjectId
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The project ID for OpenAI instance
    */
    setProjectId(projectID){
        this.organizationIDs['OpenAI-Project'] = projectID;
        createHttpClient();
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
            throwError(error);
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
            throwError(error);
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
            throwError(error);
        }
    }






    /**
    * createCompletion
    * Generate a text completion based on a prompt
    * @async
    * @param {string} prompt - The prompt to generate a completion for
    * @param {string} model - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the generation (e.g., temperature, max tokens)
    * @returns {Promise<string>} - A Promise that resolves with the generated text completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the API call
    */
    async createCompletion(promptText, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createCompletion({ promptText, modelID, ...newConfig });
            return response.data.choices[0].text.trim();
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }


    /**
    * createChatCompletion
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async createChatCompletion(messagesArray, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(messagesArray, 'Cannot process an empty messages array');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createChatCompletion({ messages: messagesArray, model: modelID, ...newConfig });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }


    /**
    * createEdit
    * @async
    * @param {string} instruction - The instruction that tells the model how to edit the prompt
    * @param {string} input - The input text to use as a starting point for the edit
    * @param {string} modelID - The OpenAI GPT model ID to use
    * @param {Object} newConfig - Optional parameters for the completion generation
    * @returns {Promise<string>} - A Promise that resolves with the generated completion
    * @throws {AIConnectifyError} - Will throw an error if the prompt is empty or if an error occurs during completion generation
    */
    async createEdit(instruction, input, modelID, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(instruction, 'Cannot process an empty instruction');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        
        try {
            const response = await this.openai.createEdit({ instruction, modelID, input, ...newConfig });
            return response.data.choices[0].message;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`ChatGPT error => ${errorMsg}`);
        }
    }
}

module.exports = ChatGPTClient;