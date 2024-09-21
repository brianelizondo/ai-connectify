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
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
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
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
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
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async generateImageDiffusion(prompt, pathImage, strength, destinationFolder, mode="image-to-image", output_format="png", newConfig={}){
        return this.client.generateImageDiffusion(prompt, pathImage, strength, destinationFolder, mode, output_format, newConfig);
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
    async upscaleConservative(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.upscaleConservative(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async upscaleCreative(prompt, pathImage, output_format="png", newConfig={}){
        return this.client.upscaleCreative(prompt, pathImage, output_format, newConfig);
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
        return this.client.getUpscaleCreative(upscaleId, destinationFolder, output_format, newConfig);
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
        return this.client.upscaleFast(pathImage, destinationFolder, output_format);
    }


    /** EDIT METHODS
    *
    * erase
    * The Erase service removes unwanted objects, such as blemishes on portraits or items on desks, using image masks
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async erase(pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.erase(pathImage, destinationFolder, output_format, newConfig);
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
    async inpaint(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.inpaint(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async outpaint(pathImage, destinationFolder, directions={ left:0, right:0, up:0, down:0 }, output_format="png", newConfig={}){
        return this.client.outpaint(pathImage, destinationFolder, directions, output_format, newConfig);
    }
    /**
    * searchAndReplace
    * The Search and Replace service is a specific version of inpainting that does not require a mask
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
    async searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async removeBackground(pathImage, destinationFolder, output_format="png"){
        return this.client.removeBackground(pathImage, destinationFolder, output_format);
    }


    /** CONTROL METHODS
    *
    * controlSketch
    * This service offers an ideal solution for design projects that require brainstorming and frequent iterations
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async controlSketch(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.controlSketch(prompt, pathImage, destinationFolder, output_format, newConfig);
    }
    /**
    * structure
    * This service excels in generating images by maintaining the structure of an input image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async controlStructure(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.controlStructure(prompt, pathImage, destinationFolder, output_format, newConfig);
    }
    /**
    * constrolStyle
    * This service excels in generating images by maintaining the structure of an input image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {string} [output_format="png"] - The output format for the response
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async constrolStyle(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.constrolStyle(prompt, pathImage, destinationFolder, output_format, newConfig);
    }


    /** 3D VIDEO METHODS
    *
    * videoStableFast
    * Stable Fast 3D generates high-quality 3D assets from a single 2D input image
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async videoStableFast(pathImage, destinationFolder, newConfig={}){
        return this.client.videoStableFast(pathImage, destinationFolder, newConfig);
    }
    /**
    * imageToVideo
    * Generate a short video based on an initial image with Stable Video Diffusion, a latent video diffusion model
    * @async
    * @param {string} pathImage - The path image to use as the starting point for the generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @param {Object} [newConfig={}] - (Optional) Configuration for the generation (e.g., temperature, max tokens)
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async imageToVideo(pathImage, destinationFolder, newConfig={}){
        return this.client.imageToVideo(pathImage, destinationFolder, newConfig);
    }
    /**
    * getImageToVideo
    * Fetch the result of an image-to-video generation by ID
    * @async
    * @param {string} videoId - The id of a generation
    * @param {string} destinationFolder - Folder path to save the image generated
    * @returns {Promise<Object>} - A Promise that resolves with the list of available models
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    async getImageToVideo(videoId, destinationFolder){
        return this.client.getImageToVideo(videoId, destinationFolder);
    }
}

module.exports = Stability;