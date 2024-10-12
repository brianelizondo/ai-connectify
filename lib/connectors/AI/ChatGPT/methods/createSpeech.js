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
* Generates audio from the input text
* @async
* @memberof ChatGPTClient
* @method createSpeech
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} input - The text to generate audio for
* @param {string} destinationFolder - Folder path to save the file generated
* @param {string} [modelID="tts-1"] - (Optional) The ID of the model to use
* @param {string} [response_format="mp3"] - (Optional) The format to audio in
* @param {string} [voice="alloy"] - (Optional) The voice to use when generating the audio
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
async function createSpeech(httpRequest, throwError, input, destinationFolder, modelID, response_format, voice, newConfig) {
    HelperFunctions.validateStringInput(input, 'Cannot process the input text');
    HelperFunctions.validateStringInput(destinationFolder, 'Cannot process the destination folder');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    HelperFunctions.validateStringInput(response_format, 'Cannot process the response format');
    
    try {
        const formData = new FormData();
        formData.append('input', input);
        formData.append('model', modelID);
        formData.append('response_format', response_format);
        formData.append('voice', voice);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.post('/audio/speech', formData, {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: { 
                ...formData.getHeaders(),
                "Content-Type": "multipart/form-data"
            }
        });

        const randomFileName = HelperFunctions.generateRandomID();
        const urlAudio = `${destinationFolder}/${randomFileName}.${response_format}`;
        fs.writeFileSync(urlAudio, Buffer.from(response));
        
        return { audio_path: urlAudio };
    } catch (error) {
        throwError(error);
    }
}

module.exports = createSpeech;