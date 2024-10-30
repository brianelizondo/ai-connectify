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
* Create a dataset by uploading a file
* @async
* @memberof CohereClient
* @method createDataset
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} name - The name of the uploaded dataset
* @param {string} filePath - File to create the dataset
* @param {string} type - The dataset type, which is used to validate the data
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function createDataset(httpRequest, throwError, name, filePath, type, newConfig) {
    HelperFunctions.validateStringInput(name, 'Cannot process the name');
    HelperFunctions.validateStringInput(filePath, 'Cannot process the file path');
    HelperFunctions.validateStringInput(type, 'Cannot process the type');

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append('data', fileStream);
        fileStream.on('error', (error) => {
            throwError(`Error reading file: ${error.message}`);
        });
        
        formData.append('name', name);
        formData.append('type', type);
        for(const key in newConfig){
            formData.append(key, newConfig[key]);
        }

        const response = await httpRequest.post('/v1/datasets', formData, {
            headers: { ...formData.getHeaders() }
        });
        return {
            dataset_id: response.id
        };
    } catch (error) {
        throwError(error);
    }
}

module.exports = createDataset;