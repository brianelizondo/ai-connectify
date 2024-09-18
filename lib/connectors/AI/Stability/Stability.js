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
const StabilityClient = require('./StabilityClient');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a Stability AI instance.
* Handles interaction with the Stability API for chat, completions, edits, and model information.
* @class ChatGPT
*/
class Stability {
    /**
    * Create a Stability instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize StabilityClient with API key
        this.client = new StabilityClient(apiKey);
    }

    /** 
    * setClientId
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        this.client.setClientId(clientID);
    }
    /** 
    * setClientUserId
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        this.client.setClientUserId(userID);
    }
    /** 
    * setClientVersion
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        this.client.setClientVersion(clientVersion);
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
    async generateImageUltra(prompt, destinationFolder, output_format="png", newConfig={}){
        return this.client.generateImageUltra(prompt, destinationFolder, output_format, newConfig);
    }
    /**
    * generateImageCore
    * Tools for generating new images with the best quality achievable at high speed
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<String>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageCore(prompt, destinationFolder, output_format="png", newConfig={}){
        return this.client.generateImageCore(prompt, destinationFolder, output_format, newConfig);
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
        return this.client.generateImageDiffusion(prompt, pathImage, strength, destinationFolder, mode, output_format, newConfig);
    }
}

module.exports = Stability;