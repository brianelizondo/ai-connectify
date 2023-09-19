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
const DALLEService = require('../../services/DALLEService');

/**
* Represents a DALL-E AI instance
* Given a prompt and/or an input image, the model will generate a new image
* @class DALLE
*/
class DALLE {
    /**
    * Create a DALLE instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @param {string} [modelID='image-alpha-001'] - The model ID 
    */
    constructor(apiKey, modelID = 'image-alpha-001') {
        // get a new service instance
        this.service = new DALLEService(apiKey, modelID);
    }

    /**
    * MODELS METHODS
    * List and describe the various models available in the API
    * Refer to the Models documentation to understand what models are available and the differences between them
    * 
    * List Models
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async listModels(){
        // Returns the corresponding method in the service client
        return this.service.listModels();
    }
    
    /**
    * Reatrive Model
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The id model to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async reatrieveModel(modelID) {
        // Returns the corresponding method in the service client
        return this.service.reatrieveModel(modelID);
    }

    /**
    * IMAGES METHODS
    * Given a prompt and/or an input image, the model will generate a new image
    * 
    * Create Image
    * Creates an image given a prompt
    * @async
    * @param {string} [promptText] - The prompt used to generate the image
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty prompt is provided
    */
    async createImage(promptText, newConfig = {}){
        // Returns the corresponding method in the service client
        return this.service.createImage(promptText, newConfig);
    }

    /**
    * Create Image Edit
    * Creates an edited or extended image given an original image and a prompt
    * @async
    * @param {string} [imagePath] - The original image
    * @param {string} [promptText] - The prompt used to generate the new image
    * @param {string} [maskPath=null] - The image mask
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided
    */
    async createImageEdit(imagePath, promptText, maskPath = null, newConfig = {}){
        // Returns the corresponding method in the service client
        return this.service.createImageEdit(imagePath, promptText, maskPath, newConfig);
    }

    /**
    * Create Image Variation
    * Creates a variation of a given image
    * @async
    * @param {string} [imagePath] - The original image
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided
    */
    async createImageVariation(imagePath, newConfig = {}){
        // Returns the corresponding method in the service client
        return this.service.createImageVariation(imagePath, newConfig);
    }
}

module.exports = DALLE;