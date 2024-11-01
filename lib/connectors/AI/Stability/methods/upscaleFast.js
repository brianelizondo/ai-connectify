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
* Fast Upscaler service enhances image resolution by 4x using predictive and generative AI
* @async
* @memberof StabilityClient
* @method upscaleFast
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) you wish to upscale
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function upscaleFast(httpRequest, throwError, pathImage, destinationFolder, output_format){
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        fileStream.on('error', (error) => {
            throwError(`Error reading image file: ${error.message}`);
        });
        formData.append('image', fileStream);
        formData.append('output_format', output_format);

        const response = await httpRequest.postForm('/stable-image/upscale/fast', formData, {
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
            await fs.promises.writeFile(urlImage, Buffer.from(response.data));
            
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

module.exports = upscaleFast;