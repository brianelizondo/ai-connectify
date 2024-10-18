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
* Retrieve a model information
* @async
* @memberof MistralClient
* @method getModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} modelID - The ID of the model to use for this request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getModel(httpRequest, throwError, modelID) {
    HelperFunctions.validateStringInput(modelID, 'Cannot process the model ID');

    try {
        const response = await httpRequest.get(`/models/${modelID}`);
        return response;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getModel;