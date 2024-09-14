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





    /**
    * createCompletion
    * Creates a completion for the provided prompt and parameters
    * @async
    * @param {string} promptText - The prompt to generate a completion for
    * @param {string} [modelID="text-davinci-003"] - (Optional) The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<string>} - A Promise that resolves with the generated completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during completion generation
    */
    async createCompletion(promptText, modelID = "text-davinci-003", newConfig = {}) {
        return this.client.createCompletion(promptText, modelID, newConfig);
    }


    /**
    * createChatCompletion
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} [modelID="gpt-3.5-turbo"] - (Optional) The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<string>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    async createChatCompletion(messagesArray, modelID = "gpt-3.5-turbo", newConfig = {}) {
        return this.client.createChatCompletion(messagesArray, modelID, newConfig);
    }


    /**
    * createEdit
    * Creates a new edit for the provided input, instruction, and parameters
    * @async
    * @param {string} instruction - The instruction telling the model how to edit the prompt
    * @param {string} [input=null] - (Optional) The input text to edit
    * @param {string} [modelID="text-davinci-edit-001"] - (Optional) The OpenAI GPT model ID to use
    * @param {Object} [newConfig={}] - (Optional) Configuration for the edit generation (e.g., temperature)
    * @returns {Promise<string>} - A Promise that resolves with the generated edit
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during edit generation
    */
    async createEdit(instruction, input = null, modelID = "text-davinci-edit-001", newConfig = {}) {
        return this.client.createEdit(instruction, input, modelID, newConfig);
    }
}

module.exports = ChatGPT;