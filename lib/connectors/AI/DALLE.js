/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';

/**
* Represents a DALL-E AI instance.
* Given a prompt and/or an input image, the model will generate a new image.
* @param {string} apiKey - The OpenAI API key.
* @param {string} [model=image-alpha-001] - The name of the DAll-E model to use.
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class DALLE {
    constructor(apiKey, model = 'image-alpha-001') {
        if (!apiKey) {
            throw new AIConnectifyError('API key is required for DAll-E');
        }

        this.apiKey = apiKey;
        this.model = model;
        this.config = {
            n: 1,
            size: "1024x1024",
            response_format: "url"
        }
        
        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);
    }

    /**
    * Creates an image given a prompt
    * @async
    * @param {string} [prompt=null] - The prompt used to generate the image.
    * @param {Object} [newConfig=null] - An optional configuration object.
    * @throws {AIConnectifyError} Will throw an error if an empty prompt is provided.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    */
    async createImage(prompt = null, newConfig = null){
        const config = { ...this.config, ...newConfig };
        if (prompt.length == 0 || !prompt){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }

        try {
            const response = await this.openai.createImage({ prompt, ...config });
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            console.log(errorMsg);
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }

    /**
    * Creates an edited or extended image given an original image and a prompt
    * @async
    * @param {string} [image=null] - The original image.
    * @param {string} [prompt=null] - The prompt used to generate the new image.
    * @param {string} [mask=null] - The image mask.
    * @param {Object} [newConfig=null] - An optional configuration object.
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    */
    async createImageEdit(image, prompt, mask = null, newConfig = null){
        const config = { ...this.config, ...newConfig };
        if (image.length == 0 || !image){
            throw new AIConnectifyError('Cannot process an empty image');
        }
        if (prompt.length == 0 || !prompt){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }

        const maskImage = mask ? createReadStream(mask) : undefined;
        try {
            const response = await this.openai.createImageEdit(
                createReadStream(image),
                prompt, 
                maskImage, 
                config.n, 
                config.size, 
                config.response_format
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }

    /**
    * Creates a variation of a given image
    * @async
    * @param {string} [image=null] - The original image.
    * @param {Object} [newConfig=null] - An optional configuration object.
    * @throws {AIConnectifyError} Will throw an error if an empty image or prompt is provided.
    * @returns {Promise<Object>} - The response data from the OpenAI API.
    */
    async createImageVariation(image = null, newConfig = null){
        const config = { ...this.config, ...newConfig };
        if (image.length == 0 || !image){
            throw new AIConnectifyError('Cannot process an empty image');
        }

        try {
            const response = await this.openai.createImageVariation(
                createReadStream(image),
                config.n, 
                config.size, 
                config.response_format
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data.error.message : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }
}

export default DALLE;