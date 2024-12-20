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
* Stable Fast 3D generates high-quality 3D assets from a single 2D input image
* @async
* @memberof StabilityClient
* @method videoStableFast
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) to generate a 3D model from
* @param {string} destinationFolder - Folder path to save the video generated
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function videoStableFast(httpRequest, throwError, pathImage, destinationFolder, newConfig){
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }
        const fileStream = fs.createReadStream(pathImage);
        fileStream.on('error', (error) => {
            throwError(`Error reading image file: ${error.message}`);
        });
        formData.append('image', fileStream);

        const response = await httpRequest.postForm('/3d/stable-fast-3d', formData, {
            validateStatus: null,
            responseType: "arraybuffer",
            headers: { 
                ...formData.getHeaders(),
                Accept: "image/*" 
            }
        });

        if(response.status === 200) {
            const randomFileName = HelperFunctions.generateRandomID();
            const urlVideo = `./${approveDestinationFolder}/${randomFileName}.gbl`;
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

module.exports = videoStableFast;