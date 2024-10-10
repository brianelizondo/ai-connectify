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
const ValidationHelpers = require('../../../../helpers/validationHelpers');

/**
* Creates an edited or extended image given an original image and a prompt
* @async
* @memberof DALLEClient
* @method createImageEdit
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} imagePath - The image PNG file (path - not file name) to edit
* @param {string} prompt - A text description of the desired image(s)
* @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function createImageEdit(httpRequest, throwError, imagePath, prompt, modelID, newConfig={}){
    ValidationHelpers.validateStringInput(imagePath, 'Cannot process the image path');
    ValidationHelpers.validateStringInput(prompt, 'Cannot process the prompt');
    ValidationHelpers.validateStringInput(modelID, 'Cannot process the model ID');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(imagePath);
        formData.append('image', fileStream);
        formData.append('prompt', prompt);
        formData.append('model', modelID);
        for(const key in newConfig){
            if(key === 'mask'){
                ValidationHelpers.validateStringInput(newConfig['mask'], 'Cannot process the mask path');
                const fileStream = fs.createReadStream(newConfig['mask']);
                formData.append('mask', fileStream);
            }else{
                formData.append(key, newConfig[key]);
            }
        }

        const response = await httpRequest.post('/images/edits', formData, {
            headers: { ...formData.getHeaders() }
        });
        return response.data;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createImageEdit;