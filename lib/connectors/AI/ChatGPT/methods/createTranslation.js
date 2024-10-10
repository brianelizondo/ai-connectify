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
* Translates audio into English
* @async
* @memberof ChatGPTClient
* @method createTranslation
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} filePath - The audio file object (path - not file name) to transcribe
* @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<String>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
async function createTranslation(httpRequest, throwError, filePath, modelID, newConfig) {
    HelperFunctions.validateStringInput(filePath, 'Cannot process the file path');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    
    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append('file', fileStream);
        formData.append('model', modelID);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.post('/audio/translations', formData, {
            headers: { ...formData.getHeaders() }
        });
        return response.text;
    } catch (error) {
        throwError(error);
    }
}

module.exports = createTranslation;