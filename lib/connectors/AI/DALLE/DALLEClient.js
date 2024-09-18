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
* Represents a service for interacting with the DALLE API
* @class DALLEClient
*/
class DALLEClient {
    /**
    * Create a ChatGPT service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'DALL-E';
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
    * Set the Organization ID to the DALLEClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    */
    setOrganizationId(organizationID){
        this.organizationIDs['OpenAI-Organization'] = organizationID;
        createHttpClient();
    }
    /** 
    * setProjectId
    * Set the Project ID to the DALLEClient instance
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


    /** IMAGES METHODS
    *
    * createImage
    * Creates an image given a prompt
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - The ID of the model to retrieve
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImage(prompt, modelID, newConfig){
        // modelID validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const response = await this.httpRequest.post('/images/generations', { ...newConfig, prompt, model: modelID });
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * createImageEdit
    * Creates an image given a prompt
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to edit
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - The ID of the model to retrieve
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImageEdit(imagePath, prompt, modelID, newConfig={}){
        // modelID validation
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process the image path');
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(imagePath);
            formData.append('file', fileStream);
            formData.append('prompt', prompt);
            formData.append('modelID', modelID);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/images/edits', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * createImageVariation
    * Creates a variation of a given image
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to edit
    * @param {string} [modelID="dall-e-2"] - The ID of the model to retrieve
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Array>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImageVariation(imagePath, modelID, newConfig={}){
        // modelID validation
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process the image path');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(imagePath);
            formData.append('file', fileStream);
            formData.append('modelID', modelID);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/images/variations', formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.data;
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = DALLEClient;