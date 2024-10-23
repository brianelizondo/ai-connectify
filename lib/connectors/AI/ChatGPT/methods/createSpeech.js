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
const HelperFunctions = require('../../../../helpers/HelperFunctions');

/** 
* Generates audio from the input text
* @async
* @memberof ChatGPTClient
* @method createSpeech
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} input - The text to generate audio for. The maximum length is 4096 characters
* @param {string} destinationFolder - Folder path to save the file generated
* @param {string} [modelID="tts-1"] - (Optional) The ID of the model to use
* @param {string} [voice="alloy"] - (Optional) The voice to use when generating the audio
* @param {string} [response_format="mp3"] - (Optional) The format to audio in
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
async function createSpeech(httpRequest, throwError, input, destinationFolder, modelID, voice, response_format, newConfig) {
    HelperFunctions.validateStringInput(input, 'Cannot process the input text');
    HelperFunctions.validateStringInput(destinationFolder, 'Cannot process the destination folder');
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');
    HelperFunctions.validateStringInput(voice, 'Cannot process the voice');
    HelperFunctions.validateStringInput(response_format, 'Cannot process the response format');
    
    try {
        const response = await httpRequest.post('/audio/speech', { ...newConfig, input, model: modelID, voice, response_format }, {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: { 
                "Content-Type": "multipart/form-data"
            }
        });

        const randomFileName = HelperFunctions.generateRandomID();
        const urlAudio = `${destinationFolder}/${randomFileName}.${response_format}`;
        await fs.promises.writeFile(urlAudio, Buffer.from(response));
        
        return { audio_path: urlAudio };
    } catch (error) {
        throwError(error);
    }
}

module.exports = createSpeech;