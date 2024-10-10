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
* The Search and Replace service is a specific version of inpainting that does not require a mask
* @async
* @memberof StabilityClient
* @method searchAndReplace
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} search_prompt - Short description of what to inpaint in the image
* @param {string} pathImage - An image (path - no the file name) containing content you wish to replace
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function searchAndReplace(httpRequest, throwError, prompt, search_prompt, pathImage, destinationFolder, output_format, newConfig){
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    HelperFunctions.validateStringInput(search_prompt, 'Cannot process the search prompt');
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

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

        const response = await httpRequest.post('/stable-image/edit/search-and-replace', formData, {
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

module.exports = searchAndReplace;