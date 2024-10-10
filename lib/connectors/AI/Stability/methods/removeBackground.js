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
* The Remove Background service accurately segments the foreground from an image and implements and removes the background
* @async
* @memberof StabilityClient
* @method removeBackground
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) whose background you wish to remove
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function removeBackground(httpRequest, throwError, pathImage, destinationFolder, output_format){
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        formData.append('image', fileStream);
        formData.append('output_format', output_format);

        const response = await httpRequest.post('/stable-image/edit/remove-background', formData, {
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

module.exports = removeBackground;