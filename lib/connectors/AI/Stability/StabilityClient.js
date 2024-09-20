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
const { generateRandomID } = require('../../../helpers/generateId');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Stability API
* @class StabilityClient
*/
class StabilityClient {
    /**
    * Create a Stability service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'Stability';
        this.aiApiKey = apiKey;
        this.clientData = {};
        this.createHttpClient();
    }


    /** 
    * createHttpClient
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(){
        this.httpRequest = new HttpClient('https://api.stability.ai/v2beta', { 
            'authorization': `Bearer ${this.aiApiKey}`, 
            'content-type': 'multipart/form-data',
            ...this.clientData 
        });
    }
    /** 
    * setClientId
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        ValidationHelpers.validateKeyString(clientID, `A valid client ID must be provided`);
        this.clientData['stability-client-id'] = clientID;
        this.createHttpClient();
    }
    /** 
    * setClientUserId
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        ValidationHelpers.validateKeyString(userID, `A valid user ID must be provided`);
        this.clientData['stability-client-user-id'] = userID;
        this.createHttpClient();
    }
    /** 
    * setClientVersion
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        ValidationHelpers.validateKeyString(clientVersion, `A valid client version must be provided`);
        this.clientData['stability-client-version'] = clientVersion;
        this.createHttpClient();
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


    /** IMAGES METHODS
    *
    * generateImageUltra
    * Tools for creates the highest quality images with unprecedented prompt understanding
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageUltra(prompt, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/generate/ultra', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * generateImageCore
    * Tools for generating new images with the best quality achievable at high speed
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageCore(prompt, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/generate/core', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * generateImageDiffusion
    * Tools for generating new images using a Stable Diffusion 3 model
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The  image to use as the starting point for the generation
    * @param {number} strength - Controls how much influence the image parameter has on the output image
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {number} [mode="image-to-image"] - Controls how much influence the image parameter has on the output image
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageDiffusion(prompt, pathImage, strength, destinationFolder, mode="image-to-image", output_format="png", newConfig={}){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateNumberInput(strength, 'Cannot process the strength value');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('strength', strength);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/generate/sd3', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }


    /** UPSCALE METHODS
    *
    * upscaleConservative
    * Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleConservative(prompt, pathImage, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/upscale/conservative', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * upscaleCreative
    * Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleCreative(prompt, pathImage, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/upscale/creative', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            return { image_id: response.data.id };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * getUpscaleCreative
    * Fetch the result of an upscale generation by ID
    * @async
    * @param {string} upscaleId - The id of a generation, typically used for async generations
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getUpscaleCreative(upscaleId, destinationFolder, output_format="png", newConfig={}){
        // inputs validation
        ValidationHelpers.validateStringInput(upscaleId, 'Cannot process the upscale ID');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.get(`/stable-image/upscale/creative/${upscaleId}`, formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            if (response.status === 202) {
                return { status: "Generation is still running, try again in 10 seconds" };
            }

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * upscaleFast
    * Fast Upscaler service enhances image resolution by 4x using predictive and generative AI
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleFast(pathImage, destinationFolder, output_format="png"){
        // inputs validation
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);

            const response = await this.httpRequest.post('/stable-image/upscale/fast', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }


    /** EDIT METHODS
    *
    * erase
    * Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async erase(pathImage, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/edit/erase', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * inpaint
    * Intelligently modify images by filling in or replacing specified areas with new content based on the content of a "mask" image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async inpaint(prompt, pathImage, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/edit/inpaint', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * outpaint
    * The Outpaint service inserts additional content in an image to fill in the space in any direction
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [directions={ left:0, right:0, up:0, down:0 }] - Along with at least one outpaint direction
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async outpaint(pathImage, destinationFolder, directions, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);
            for(const key in directions){
                formData.append(key, directions[key]);
            }
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/edit/outpaint', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * searchAndReplace
    * Intelligently modify images by filling in or replacing specified areas with new content based on the content of a "mask" image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} search_prompt - Short description of what to inpaint in the image
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(search_prompt, 'Cannot process the search prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('search_prompt', search_prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/edit/search-and-replace', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * searchAndRecolor
    * The Search and Recolor service provides the ability to change the color of a specific object in an image using a prompt
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} select_prompt - Short description of what to search for in the image
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, newConfig){
        // inputs validation
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt text');
        ValidationHelpers.validateStringInput(select_prompt, 'Cannot process the select prompt text');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('select_prompt', select_prompt);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/stable-image/edit/search-and-recolor', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
    /**
    * removeBackground
    * The Outpaint service inserts additional content in an image to fill in the space in any direction
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async removeBackground(pathImage, destinationFolder, output_format){
        // inputs validation
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);

            const response = await this.httpRequest.post('/stable-image/edit/remove-background', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            });

            const randomFileName = generateRandomID();
            const urlImage = `${destinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));
            
            return { image_path: urlImage };
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = StabilityClient;