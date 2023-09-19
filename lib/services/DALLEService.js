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
const AIConnectifyError = require('../../AIConnectifyError');
const ValidationHelpers = require('../../helpers/validationHelpers');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

/**
* Represents a service for interacting with the DALLE API
* @class DALLE Service
*/
class DALLEService {
    /**
    * Create a DALLE service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @param {string} [modelID='image-alpha-001'] - The model ID 
    */
    constructor(apiKey, modelID = 'image-alpha-001') {
        this.model = modelID;
        this.defaultConfig = {
            n: 1,
            size: "1024x1024",
            response_format: "url",
            user: undefined
        }
        
        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);

        /**
        * Merge default and new configurations
        * @function
        * @param {Object} defaultConfig - Default configuration
        * @param {Object} newConfig - New configuration
        * @returns {Object} Merged configuration
        */
        this.mergeConfigs = (defaultConfig, newConfig) => {
            return { ...defaultConfig, ...newConfig };
        }
    }

    /**
    * SERVICES METHODS
    * 
    * List Models
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async listModels(){
        try {
            const response = await this.openai.listModels();
            return response.data.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }
    
    /**
    * Reatrive Model
    * @async
    * @param {string} modelID - The id model to get basic information
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async reatrieveModel(modelID) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process the model ID');

        try {
            const response = await this.openai.retrieveModel(modelID);
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }

    /**
    * Create Image
    * @async
    * @param {string} [promptText] - The prompt used to generate the image
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty prompt is provided
    */
    async createImage(promptText, newConfig = {}){
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        
        try {
            const mergedConfig = this.mergeConfigs(this.defaultConfig, newConfig);
            const response = await this.openai.createImage({ promptText, ...mergedConfig });
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            console.log(errorMsg);
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }

    /**
    * Create Image Edit
    * @async
    * @param {string} [imagePath] - The original image
    * @param {string} [promptText] - The prompt used to generate the new image
    * @param {string} [mask=null] - The image mask
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided
    */
    async createImageEdit(imagePath, promptText, maskPath = null, newConfig = {}){
        // Preview inputs validations
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process an empty image path');
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        if(maskPath !== null){ ValidationHelpers.validateStringInput(maskPath, 'Cannot process an empty mask path') };

        try {
            const maskImage = maskPath ? fs.createReadStream(maskPath) : undefined;
            const mergedConfig = this.mergeConfigs(this.defaultConfig, newConfig);
            const response = await this.openai.createImageEdit(
                fs.createReadStream(imagePath),
                maskImage,
                promptText, 
                mergedConfig.n, 
                mergedConfig.size, 
                mergedConfig.response_format,
                mergedConfig.user
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }

    /**
    * Create Image Variation
    * @async
    * @param {string} [imagePath] - The original image
    * @param {Object} [newConfig={}] - An optional configuration object
    * @returns {Promise<Object>} - The response data from the OpenAI API
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided
    */
    async createImageVariation(imagePath, newConfig = {}){
        // Preview inputs validations
        ValidationHelpers.validateStringInput(imagePath, 'Cannot process an empty image path');

        try {
            const mergedConfig = this.mergeConfigs(this.defaultConfig, newConfig);
            const response = await this.openai.createImageVariation(
                fs.createReadStream(imagePath),
                mergedConfig.n, 
                mergedConfig.size, 
                mergedConfig.response_format,
                mergedConfig.user
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }
}

module.exports = DALLEService;