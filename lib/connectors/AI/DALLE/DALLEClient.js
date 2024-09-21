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
    * Create a DALLE service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'DALL-E';
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


    /** IMAGES METHODS */
    /**
    * Given a prompt and/or an input image, the model will generate a new image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImage(prompt, modelID, newConfig){
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
    * Creates an edited or extended image given an original image and a prompt
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to edit
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImageEdit(imagePath, prompt, modelID, newConfig={}){
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process the image path');
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(imagePath);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('model', modelID);
            for(const key in newConfig){
                if(key === 'mask'){
                    ValidationHelpers.validateStringInput(newConfig['mask'], 'Cannot process the mask path');
                    const fileStream = fs.createReadStream(newConfig['mask']);
                    formData.append('mask', fileStream);
                }else{
                    formData.append(key, newConfig[key]);
                }
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
    * Creates a variation of a given image
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to use as the basis for the variation(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async createImageVariation(imagePath, modelID, newConfig={}){
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process the image path');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(imagePath);
            formData.append('image', fileStream);
            formData.append('model', modelID);
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