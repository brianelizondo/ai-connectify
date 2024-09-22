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
        this.httpRequest = this.createHttpClient();
    }


    /** 
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(){
        return new HttpClient('https://api.stability.ai/v2beta', { 
            'authorization': `Bearer ${this.aiApiKey}`, 
            'content-type': 'multipart/form-data',
            ...this.clientData 
        });
    }
    /** 
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        ValidationHelpers.validateKeyString(clientID, `A valid client ID must be provided`);
        this.clientData['stability-client-id'] = clientID;
        this.httpRequest = this.createHttpClient();
    }
    /** 
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        ValidationHelpers.validateKeyString(userID, `A valid user ID must be provided`);
        this.clientData['stability-client-user-id'] = userID;
        this.httpRequest = this.createHttpClient();
    }
    /** 
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        ValidationHelpers.validateKeyString(clientVersion, `A valid client version must be provided`);
        this.clientData['stability-client-version'] = clientVersion;
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


    /** IMAGES METHODS **/
    /**
    * Creates the highest quality images with unprecedented prompt understanding
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageUltra(prompt, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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
    * Tools for generating new images with the best quality achievable at high speed
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageCore(prompt, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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
    * Tools for generating new images using a Stable Diffusion 3 model
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - The  image (path - no the file name)  to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {number} strength - Controls how much influence the image parameter has on the generated image
    * @param {string} [modelID="sd3-large"] - (Optional) The ID of the model to use
    * @param {number} [mode="text-to-image"] - (Optional) Controls whether this is a text-to-image or image-to-image generation
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageDiffusion(prompt, pathImage, destinationFolder, strength, modelID, mode, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateNumberInput(strength, 'Cannot process the strength value');
        ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');
        ValidationHelpers.validateStringInput(mode, 'Cannot process the mode');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('prompt', prompt);
            formData.append('strength', strength);
            formData.append('model', modelID);
            formData.append('mode', mode);
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


    /** UPSCALE METHODS **/
    /** 
    * Tools for increasing the size of your existing images
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - The image (path - no the file name) you wish to upscale
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleConservative(prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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
    * Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - The image (path - no the file name) you wish to upscale
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleCreative(prompt, pathImage, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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
    * Fetch the result of an upscale generation by ID
    * @async
    * @param {string} upscaleId - The id of a generation, typically used for async generations
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getUpscaleCreative(upscaleId, destinationFolder, output_format, newConfig){
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
    * Fast Upscaler service enhances image resolution by 4x using predictive and generative AI
    * @async
    * @param {string} pathImage - The image (path - no the file name) you wish to upscale
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async upscaleFast(pathImage, destinationFolder, output_format){
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


    /** EDIT METHODS **/
    /**
    * The Erase service removes unwanted objects, such as blemishes on portraits or items on desks, using image masks
    * @async
    * @param {string} pathImage - The image (path - no the file name) you wish to erase from
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async erase(pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);
            for(const key in newConfig){
                if(key === 'mask'){
                    ValidationHelpers.validateStringInput(newConfig['mask'], 'Cannot process the mask image path folder');
                    const fileStream = fs.createReadStream(newConfig['mask']);
                    formData.append('mask', fileStream);
                }else{
                    formData.append(key, newConfig[key]);
                }
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
    * Intelligently modify images by filling in or replacing specified areas with new content based on the content of a "mask" image
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - The image (path - no the file name) you wish to inpaint
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async inpaint(prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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
                if(key === 'mask'){
                    ValidationHelpers.validateStringInput(newConfig['mask'], 'Cannot process the mask image path folder');
                    const fileStream = fs.createReadStream(newConfig['mask']);
                    formData.append('mask', fileStream);
                }else{
                    formData.append(key, newConfig[key]);
                }
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
    * The Outpaint service inserts additional content in an image to fill in the space in any direction
    * @async
    * @param {string} pathImage - The image (path - no the file name) you wish to outpaint
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [directions={ left:0, right:0, up:0, down:0 }] - (Optional) Along with at least one outpaint direction
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async outpaint(pathImage, destinationFolder, directions, output_format, newConfig){
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateStringInput(output_format, 'Cannot process the output format');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('output_format', output_format);
            formData.append('left', directions.left);
            formData.append('right', directions.right);
            formData.append('up', directions.up);
            formData.append('down', directions.down);
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
    * The Search and Replace service is a specific version of inpainting that does not require a mask
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} search_prompt - Short description of what to inpaint in the image
    * @param {string} pathImage - An image (path - no the file name) containing content you wish to replace
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(search_prompt, 'Cannot process the search prompt');
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
    * The Search and Recolor service provides the ability to change the color of a specific object in an image using a prompt
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} select_prompt - Short description of what to search for in the image
    * @param {string} pathImage - An image (path - no the file name) containing content you wish to recolor
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
        ValidationHelpers.validateStringInput(select_prompt, 'Cannot process the select prompt');
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
    * The Remove Background service accurately segments the foreground from an image and implements and removes the background
    * @async
    * @param {string} pathImage - The image (path - no the file name) whose background you wish to remove
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async removeBackground(pathImage, destinationFolder, output_format){
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

    
    /** CONTROL METHODS **/
    /** 
    * This service offers an ideal solution for design projects that require brainstorming and frequent iterations
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - The path image (path - no the file name) to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async controlSketch(prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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

            const response = await this.httpRequest.post('/stable-image/control/sketch', formData, {
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
    * This service excels in generating images by maintaining the structure of an input image
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - An image (path - no the file name) whose structure you wish to use as the foundation for a generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async controlStructure(prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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

            const response = await this.httpRequest.post('/stable-image/control/structure', formData, {
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
    * This service extracts stylistic elements from an input image (control image) and uses it to guide the creation of an output image based on the prompt
    * @async
    * @param {string} prompt - What you wish to see in the output image
    * @param {string} pathImage - An image (path - no the file name) whose style you wish to use as the foundation for a generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - (Optional) The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async constrolStyle(prompt, pathImage, destinationFolder, output_format, newConfig){
        ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
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

            const response = await this.httpRequest.post('/stable-image/control/style', formData, {
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


    /** 3D VIDEO METHODS **/
    /**
    * Stable Fast 3D generates high-quality 3D assets from a single 2D input image
    * @async
    * @param {string} pathImage - The image (path - no the file name) to generate a 3D model from
    * @param {string} destinationFolder - Folder path to save the video generated
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async videoStableFast(pathImage, destinationFolder, newConfig){
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/3d/stable-fast-3d', formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders()
                }
            });

            const randomFileName = generateRandomID();
            const urlVideo = `${destinationFolder}/${randomFileName}.glb`;
            fs.writeFileSync(urlVideo, Buffer.from(response.data));
            
            return { video_path: urlVideo };
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Generate a short video based on an initial image with Stable Video Diffusion, a latent video diffusion model
    * @async
    * @param {string} pathImage - The source image (path - no the file name) used in the video generation process
    * @param {string} destinationFolder - Folder path to save the video generated
    * @param {string} [cfg_scale=1.8] - (Optional) How strongly the video sticks to the original image
    * @param {string} [motion_bucket_id=127] - (Optional) Lower values generally result in less motion in the output video
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async imageToVideo(pathImage, destinationFolder, cfg_scale, motion_bucket_id, newConfig){
        ValidationHelpers.validateStringInput(pathImage, 'Cannot process the image path folder');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');
        ValidationHelpers.validateNumberInput(cfg_scale, 'Cannot process the cfg scale');
        ValidationHelpers.validateNumberInput(motion_bucket_id, 'Cannot process the motion bucket ID');

        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(pathImage);
            formData.append('image', fileStream);
            formData.append('cfg_scale', cfg_scale);
            formData.append('motion_bucket_id', motion_bucket_id);
            for(const key in newConfig){
                formData.append(key, newConfig[key]);
            }

            const response = await this.httpRequest.post('/image-to-video', formData, {
                validateStatus: undefined,
                headers: { 
                    ...formData.getHeaders()
                }
            });

            return { video_generated_id: response.data.id };
        } catch (error) {
            this.throwError(error);
        }
    }
    
    /**
    * Fetch the result of an image-to-video generation by ID
    * @async
    * @param {string} videoId - The id of a generation
    * @param {string} destinationFolder - Folder path to save the video generated
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getImageToVideo(videoId, destinationFolder){
        ValidationHelpers.validateStringInput(videoId, 'Cannot process the video ID');
        ValidationHelpers.validateStringInput(destinationFolder, 'Cannot process the destionation folder');

        try {
            const formData = new FormData();
            formData.append('id', videoId);

            const response = await this.httpRequest.get(`/image-to-video/result/${videoId}`, formData, {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "video/*"
                }
            });

            if (response.status === 202) {
                return { status: "Generation is still running, try again in 10 seconds" };
            }

            const randomFileName = generateRandomID();
            const urlVideo = `${destinationFolder}/${randomFileName}.mp4`;
            fs.writeFileSync(urlVideo, Buffer.from(response.data));
            
            return { video_path: urlVideo };
        } catch (error) {
            this.throwError(error);
        }
    }
}

module.exports = StabilityClient;