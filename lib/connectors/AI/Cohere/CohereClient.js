/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* @module CohereClient
*/
/**
* Module and dependencies
*/
const fs = require('fs');
const path = require('path');
const HelperFunctions = require('../../../helpers/HelperFunctions');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Cohere API
* @class 
*/
class CohereClient {
    /**
    * Create a Cohere service instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere
    */
    constructor(apiKey) {
        this.aiName = 'Cohere';
        this.aiApiKey = apiKey;
        this.httpRequest = new HttpClient('https://api.cohere.com/', { Authorization: `bearer ${apiKey}` });
        this._loadMethods();
    }

    /**
    * Loads all available methods from the 'methods' directory
    * and assigns them to the current instance
    * @private
    */
    _loadMethods() {
        const methodsPath = path.join(__dirname, 'methods'); 
        const methodFiles = fs.readdirSync(methodsPath);

        methodFiles.forEach((file) => {
            const methodName = path.basename(file, '.js');
            const method = require(path.join(methodsPath, file));

            this[methodName] = async (...args) => {
                return method(this.httpRequest, this.throwError.bind(this), ...args);
            };
        });
    }

    /** 
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    * @throws {AIConnectifyError} Throws an error if the provided client name is invalid
    */
    setClientName(clientName){
        HelperFunctions.validateStringInput(clientName, 'Cannot process the client name');
        this.httpRequest = new HttpClient('https://api.cohere.com', { Authorization: `bearer ${this.aiApiKey}`, 'X-Client-Name': clientName });
    }
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error){
        const errorMsg = error.response 
            ? `${error.status} - ${error.response.data.message}` 
            : `Unexpected request error - ${error}`;
        this.httpRequest.throwError(`${this.aiName.toUpperCase()} ERROR => ${errorMsg}`);
    }
}

module.exports = CohereClient;