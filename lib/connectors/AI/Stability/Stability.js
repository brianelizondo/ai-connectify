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
const HelperFunctions = require('../../../helpers/HelperFunctions');

/**
* Represents a Stability AI instance
* Stability offer a growing set of methods to build the best in class image applications
* @class Stability
*/
class Stability {
    /**
    * Create a Stability instance
    * @constructor
    * @param {string} apiKey - The API key for Stability API
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        HelperFunctions.validateKeyString(apiKey, 'API key is required for initializing Stability instance');
        
        // Initialize StabilityClient with API key
        this.client = new StabilityClient(apiKey);
    }

    /** 
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        this.client.setClientId(clientID);
    }
    /** 
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        this.client.setClientUserId(userID);
    }
    /** 
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        this.client.setClientVersion(clientVersion);
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
    async generateImageUltra(prompt, destinationFolder, output_format="png", newConfig={}){
        return this.client.generateImageUltra(prompt, destinationFolder, output_format, newConfig);
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
    async generateImageCore(prompt, destinationFolder, output_format="png", newConfig={}){
        return this.client.generateImageCore(prompt, destinationFolder, output_format, newConfig);
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
    async generateImageDiffusion(prompt, pathImage, destinationFolder, strength, modelID="sd3-large",mode="text-to-image", output_format="png", newConfig={}){
        return this.client.generateImageDiffusion(prompt, pathImage, destinationFolder, strength, modelID, mode, output_format, newConfig);
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
    async upscaleConservative(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.upscaleConservative(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async upscaleCreative(prompt, pathImage, output_format="png", newConfig={}){
        return this.client.upscaleCreative(prompt, pathImage, output_format, newConfig);
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
    async getUpscaleCreative(upscaleId, destinationFolder, output_format="png", newConfig={}){
        return this.client.getUpscaleCreative(upscaleId, destinationFolder, output_format, newConfig);
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
    async upscaleFast(pathImage, destinationFolder, output_format="png"){
        return this.client.upscaleFast(pathImage, destinationFolder, output_format);
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
    async erase(pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.erase(pathImage, destinationFolder, output_format, newConfig);
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
    async inpaint(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.inpaint(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async outpaint(pathImage, destinationFolder, directions={ left:0, right:0, up:0, down:0 }, output_format="png", newConfig={}){
        return this.client.outpaint(pathImage, destinationFolder, directions, output_format, newConfig);
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
    async searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async removeBackground(pathImage, destinationFolder, output_format="png"){
        return this.client.removeBackground(pathImage, destinationFolder, output_format);
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
    async controlSketch(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.controlSketch(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async controlStructure(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.controlStructure(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async constrolStyle(prompt, pathImage, destinationFolder, output_format="png", newConfig={}){
        return this.client.constrolStyle(prompt, pathImage, destinationFolder, output_format, newConfig);
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
    async videoStableFast(pathImage, destinationFolder, newConfig={}){
        return this.client.videoStableFast(pathImage, destinationFolder, newConfig);
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
    async imageToVideo(pathImage, destinationFolder, cfg_scale=1.8, motion_bucket_id=127, newConfig={}){
        return this.client.imageToVideo(pathImage, destinationFolder, cfg_scale, motion_bucket_id, newConfig);
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
        return this.client.getImageToVideo(videoId, destinationFolder);
    }
}

module.exports = Stability;