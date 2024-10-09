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

/**
* Lists the currently available models, and provides basic information about each one such as the owner and availability
* @async
* @memberof ChatGPTClient
* @method getModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
async function getModels(httpRequest, throwError){
    try {
        const response = await httpRequest.get('/models');
        return response.data;
    } catch (error) {
        throwError(error);
    }
}

module.exports = getModels;