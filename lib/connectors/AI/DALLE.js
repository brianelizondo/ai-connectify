/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const AIConnectifyError = require('../../AIConnectifyError');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

/**
* Represents a DALL-E AI instance.
* Given a prompt and/or an input image, the model will generate a new image.
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class DALLE {
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

        // Method to merge default and new configs
        this.mergeConfigs = (defaultConfig, newConfig) => {
            return { ...defaultConfig, ...newConfig };
        }
    }

    /**
    * MODELS METHODS
    * List and describe the various models available in the API. 
    * Refer to the Models documentation to understand what models are available and the differences between them.
    * 
    * List Models
    * Lists the currently available models, and provides basic information about each one such as the owner and availability.
    * @async
    * @returns {Promise<Array>} - A Promise that resolves with the generated list of models.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
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
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
    * @async
    * @param {String} modelID - The id model to get basic information.
    * @returns {Promise<Object>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async reatrieveModel(modelID) {
        if (typeof modelID !== 'string'){
            throw new AIConnectifyError('Cannot process the model ID');
        }

        try {
            const response = await this.openai.retrieveModel(modelID);
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`DALLE error => ${errorMsg}`);
        }
    }

    /**
    * IMAGES METHODS
    * Given a prompt and/or an input image, the model will generate a new image.
    * 
    * Create Image
    * Creates an image given a prompt
    * @async
    * @param {String} [promptText=null] - The prompt used to generate the image.
    * @param {Object} [newConfig={}] - An optional configuration object.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    * @throws {AIConnectifyError} Will throw an error if an empty prompt is provided.
    */
    async createImage(promptText = null, newConfig = {}){
        if (!promptText || typeof promptText !== 'string'){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }
        
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
    * Creates an edited or extended image given an original image and a prompt
    * @async
    * @param {String} [imagePath=null] - The original image.
    * @param {String} [promptText=null] - The prompt used to generate the new image.
    * @param {String} [mask=null] - The image mask.
    * @param {Object} [newConfig={}] - An optional configuration object.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided.
    */
    async createImageEdit(imagePath, promptText, maskPath = null, newConfig = {}){
        if (!imagePath || typeof imagePath !== 'string'){
            throw new AIConnectifyError('Cannot process an empty image path');
        }
        if (!promptText || typeof promptText !== 'string'){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }
        if (maskPath && maskPath.length == 0){
            throw new AIConnectifyError('Cannot process an empty mask path');
        }

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
    * Creates a variation of a given image
    * @async
    * @param {String} [imagePath=null] - The original image.
    * @param {Object} [newConfig={}] - An optional configuration object.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided.
    */
    async createImageVariation(imagePath = null, newConfig = {}){
        if (!imagePath || typeof imagePath !== 'string'){
            throw new AIConnectifyError('Cannot process an empty image path');
        }

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

module.exports = DALLE;