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
* Generate a short video based on an initial image with Stable Video Diffusion, a latent video diffusion model
* @async
* @memberof StabilityClient
* @method imageToVideo
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The source image (path - no the file name) used in the video generation process
* @param {string} [cfg_scale=1.8] - (Optional) How strongly the video sticks to the original image
* @param {string} [motion_bucket_id=127] - (Optional) Lower values generally result in less motion in the output video
* @param {Object} [seed=0] - (Optional) A specific value that is used to guide the 'randomness' of the generation
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function imageToVideo(httpRequest, throwError, pathImage, cfg_scale, motion_bucket_id, seed){
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateNumberInput(cfg_scale, 'Cannot process the cfg scale');
    HelperFunctions.validateNumberInput(motion_bucket_id, 'Cannot process the motion bucket ID');
    HelperFunctions.validateNumberInput(seed, 'Cannot process the seed');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        fileStream.on('error', (error) => {
            throwError(`Error reading image file: ${error.message}`);
        });
        formData.append('image', fileStream);
        formData.append('cfg_scale', cfg_scale);
        formData.append('motion_bucket_id', motion_bucket_id);
        formData.append('seed', seed);

        const response = await httpRequest.postForm('/image-to-video', formData, {
            validateStatus: null,
            headers: { 
                ...formData.getHeaders()
            }
        });

        return { video_generated_id: response.data.id };
    } catch (error) {
        if (error.name === 'AIConnectifyError') {
            throw error;
        }else{
            throwError(error);
        } 
    }
}

module.exports = imageToVideo;