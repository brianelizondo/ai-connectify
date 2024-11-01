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
        const response = await httpRequest.getFull(`/image-to-video/result/${videoId}`, {}, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                Accept: "video/*" 
            }
        });

        if (response.status === 202) {
            return { status: "Generation is still running, try again in 10 seconds" };
        }else if(response.status === 200) {
            const urlVideo = `./${approveDestinationFolder}/${videoId}.mp4`;
            await fs.promises.writeFile(urlVideo, Buffer.from(response.data));

            return { video_path: urlVideo };
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

module.exports = getImageToVideo;