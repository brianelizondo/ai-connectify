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
* Tools for generating new images using a Stable Diffusion 3 model
* @async
* @memberof StabilityClient
* @method generateImageDiffusion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} destinationFolder - Folder path to save the image generated
* @param {number} strength - Controls how much influence the image parameter has on the generated image
* @param {string} [modelID="sd3.5-medium"] - (Optional) The ID of the model to use
* @param {number} [mode="text-to-image"] - (Optional) Controls whether this is a text-to-image or image-to-image generation
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function generateImageDiffusion(httpRequest, throwError, prompt, destinationFolder, strength, modelID, mode, output_format, newConfig){
    HelperFunctions.validateStringInput(prompt, 'Cannot process the prompt');
    
    HelperFunctions.validateNumberInput(strength, 'Cannot process the strength value');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    HelperFunctions.validateStringInput(mode, 'Cannot process the mode');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        for(const key in newConfig){
            // check if the image path key is in the config
            if(key === "image"){
                HelperFunctions.validateStringInput(newConfig[key], 'Cannot process the image path folder');
                
                const fileStream = fs.createReadStream(newConfig[key]);
                fileStream.on('error', (error) => {
                    throwError(`Error reading image file: ${error.message}`);
                });
                formData.append('image', fileStream);
            }else{
                formData.append(key, newConfig[key]);
            }
        }
        formData.append('prompt', prompt);
        formData.append('strength', strength);
        formData.append('model', modelID);
        formData.append('mode', mode);
        formData.append('output_format', output_format);

        const response = await httpRequest.postForm('/stable-image/generate/sd3', formData, {
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

module.exports = generateImageDiffusion;