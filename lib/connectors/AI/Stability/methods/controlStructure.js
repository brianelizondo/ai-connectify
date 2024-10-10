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
* This service excels in generating images by maintaining the structure of an input image
* @async
* @memberof StabilityClient
* @method controlStructure
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} pathImage - An image (path - no the file name) whose structure you wish to use as the foundation for a generation
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function controlStructure(httpRequest, throwError, prompt, pathImage, destinationFolder, output_format, newConfig){
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        formData.append('image', fileStream);
        formData.append('prompt', prompt);
        formData.append('output_format', output_format);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.postForm('/stable-image/control/structure', formData, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                ...formData.getHeaders(),
                Accept: "image/*" 
            }
        });

        if(response.status === 200) {
            const randomFileName = HelperFunctions.generateRandomID();
            const urlImage = `./${approveDestinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));

            return { image_path: urlImage };
        } else {
            const errorMessage = Array.isArray(response.data.errors) 
                ? response.data.errors.join(', ')
                : response.data.errors?.toString() || 'The image could not be generated';
            throwError(errorMessage);
        }
    } catch (error) {
        if (error.name === 'AIConnectifyError') {
            throw error;
        }
        
        const errorMessage = error.response?.data?.errors 
            || error.response?.data?.message 
            || error.message 
            || 'An unexpected error occurred';
        throwError(errorMessage);
    }
}

module.exports = controlStructure;