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
* Intelligently modify images by filling in or replacing specified areas with new content based on the content of a "mask" image
* @async
* @memberof StabilityClient
* @method inpaint
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} pathImage - The image (path - no the file name) you wish to inpaint
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function inpaint(httpRequest, throwError, prompt, pathImage, destinationFolder, output_format, newConfig){
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
            if(key === 'mask'){
                HelperFunctions.validateStringInput(newConfig['mask'], 'Cannot process the mask image path folder');
                const fileStream = fs.createReadStream(newConfig['mask']);
                formData.append('mask', fileStream);
            }else{
                formData.append(key, newConfig[key]);
            }
        }

        const response = await httpRequest.post('/stable-image/edit/inpaint', formData, {
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

module.exports = inpaint;