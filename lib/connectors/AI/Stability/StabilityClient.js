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
    * @returns {Promise<String>} - A Promise that resolves with the list of available models
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
    * @returns {Promise<String>} - A Promise that resolves with the list of available models
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
}

module.exports = StabilityClient;