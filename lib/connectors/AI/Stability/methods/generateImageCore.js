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
* Tools for generating new images with the best quality achievable at high speed
* @async
* @memberof StabilityClient
* @method generateImageCore
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function generateImageCore(httpRequest, throwError, prompt, destinationFolder, output_format, newConfig){
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('output_format', output_format);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }
          
        const response = await httpRequest.postForm('/stable-image/generate/core',
            formData,
            {
                validateStatus: null,
                responseType: "arraybuffer",
                headers: { 
                    ...formData.getHeaders(),
                    Accept: "image/*" 
                }
            },
        );
          
        if(response.status === 200) {
            const randomFileName = HelperFunctions.generateRandomID();
            const urlImage = `./${approveDestinationFolder}/${randomFileName}.${output_format}`;
            fs.writeFileSync(urlImage, Buffer.from(response.data));

            return { image_path: urlImage };
        } else {
            throwError(response);
        }
    } catch (error) {
        if (error.name === 'AIConnectifyError') {
            throw error;
        }else{
            throwError(error);
        } 
    }
}

module.exports = generateImageCore;