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
const HelperFunctions = require('../../../../helpers/HelperFunctions');

/**
* Retrieve a dataset by ID
* @async
* @memberof CohereClient
* @method getDataset
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} dataset_id - The ID of the dataset to retrieve
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getDataset(httpRequest, throwError, dataset_id) {
    HelperFunctions.validateStringInput(dataset_id, 'Cannot process the dataset ID');

    try {
        const response = await httpRequest.get(`/v1/datasets/${dataset_id}`);
        return response.dataset;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getDataset;