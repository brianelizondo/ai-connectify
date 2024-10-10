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
* Fetch the result of an image-to-video generation by ID
* @async
* @memberof StabilityClient
* @method getImageToVideo
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} videoId - The id of a generation
* @param {string} destinationFolder - Folder path to save the video generated
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getImageToVideo(httpRequest, throwError, videoId, destinationFolder){
    HelperFunctions.validateStringInput(videoId, 'Cannot process the video ID');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        formData.append('id', videoId);

        const response = await httpRequest.get(`/image-to-video/result/${videoId}`, formData, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                ...formData.getHeaders(),
                Accept: "video/*" 
            }
        });

        if (response.status === 202) {
            return { status: "Generation is still running, try again in 10 seconds" };
        }else if(response.status === 200) {
            const urlVideo = `./${approveDestinationFolder}/${videoId}.mp4`;
            fs.writeFileSync(urlVideo, Buffer.from(response.data));

            return { video_path: urlVideo };
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

module.exports = getImageToVideo;