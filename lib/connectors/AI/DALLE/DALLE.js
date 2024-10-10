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
const DALLEClient = require('./DALLEClient');
const HelperFunctions = require('../../../helpers/HelperFunctions');

/**
* Represents a DALL-E AI instance
* Given a prompt and/or an input image, the model will generate a new image
* @class DALL-E
*/
class DALLE {
    /**
    * Create a DALLE instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing DALL-E instance');
        
        // Initialize DALLEClient with API key
        this.client = new DALLEClient(apiKey);
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
    async createImage(prompt, modelID="dall-e-2", newConfig={}){
        return this.client.createImage(prompt, modelID, newConfig);
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
    async createImageEdit(imagePath, prompt, modelID="dall-e-2", newConfig={}){
        return this.client.createImageEdit(imagePath, prompt, modelID, newConfig);
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
    async createImageVariation(imagePath, modelID="dall-e-2", newConfig={}){
        return this.client.createImageVariation(imagePath, modelID, newConfig);
    }
}

module.exports = DALLE;