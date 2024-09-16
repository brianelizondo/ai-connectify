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
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

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
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize DALLEClient with API key
        this.client = new DALLEClient(apiKey);
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
    async createImage(prompt, modelID, newConfig={}){
        return this.client.createImage(prompt, modelID, newConfig);
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
        return this.client.createImageEdit(imagePath, prompt, modelID, newConfig);
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
        return this.client.createImageVariation(imagePath, modelID, newConfig);
    }
}

module.exports = DALLE;