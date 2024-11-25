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
* Fetch the result of an upscale generation by ID
* @async
* @memberof StabilityClient
* @method getUpscaleCreative
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} upscaleId - The id of a generation, typically used for async generations
* @param {string} destinationFolder - Folder path to save the image generated
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getUpscaleCreative(httpRequest, throwError, upscaleId, destinationFolder){
    HelperFunctions.validateStringInput(upscaleId, 'Cannot process the upscale ID');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const response = await httpRequest.getFull(`/stable-image/upscale/creative/${upscaleId}`, {}, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                Accept: "image/*" 
            }
        });

        if (response.status === 202) {
            return { status: "Generation is still running, try again in 10 seconds" };
        }else if(response.status === 200) {
            // get the mime type
            const contentType = response.headers['content-type'];
            let outputFormat;
            if (contentType.includes('jpeg')) {
                outputFormat = "jpeg";
            } else if (contentType.includes('png')){
                outputFormat = "png";
            } else {
                outputFormat = "webp";
            }

            const urlImage = `./${approveDestinationFolder}/${upscaleId}.${outputFormat}`;
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

module.exports = getUpscaleCreative;