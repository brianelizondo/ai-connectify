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
* The Outpaint service inserts additional content in an image to fill in the space in any direction
* @async
* @memberof StabilityClient
* @method outpaint
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) you wish to outpaint
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [directions={ left:0, right:0, up:0, down:0 }] - (Optional) Along with at least one outpaint direction
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function outpaint(httpRequest, throwError, pathImage, destinationFolder, directions, output_format, newConfig){
    HelperFunctions.validateStringInput(pathImage, 'Cannot process the image path folder');
    HelperFunctions.validateStringInput(output_format, 'Cannot process the output format');
    const approveDestinationFolder = HelperFunctions.validateAndReturnPath(destinationFolder, 'destination folder');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(pathImage);
        formData.append('image', fileStream);
        formData.append('output_format', output_format);
        formData.append('left', directions.left);
        formData.append('right', directions.right);
        formData.append('up', directions.up);
        formData.append('down', directions.down);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.post('/stable-image/edit/outpaint', formData, {
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

module.exports = outpaint;