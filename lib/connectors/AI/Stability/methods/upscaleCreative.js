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
const FormData = require('form-data');
const HelperFunctions = require('../../../../helpers/HelperFunctions');

/**
* Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
* @async
* @memberof StabilityClient
* @method upscaleCreative
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} pathImage - The image (path - no the file name) you wish to upscale
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function upscaleCreative(httpRequest, throwError, prompt, pathImage, output_format, newConfig){
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        formData.append('image', fileStream);
        formData.append('prompt', prompt);
        formData.append('output_format', output_format);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.post('/stable-image/upscale/creative', formData, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                ...formData.getHeaders(),
                Accept: "image/*" 
            }
        });

        return { image_id: response.data.id };
    } catch (error) {
        if (error.name === 'AIConnectifyError') {
            throw error;
        }else{
            throwError(error);
        } 
    }
}

module.exports = upscaleCreative;