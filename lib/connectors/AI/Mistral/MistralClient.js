/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* @module MistralClient
*/
/**
* Module and dependencies
*/
const HelperFunctions = require('../../../helpers/HelperFunctions');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Mistral API
* @class
*/
class MistralClient {
    /**
    * Create a Mistral service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'Mistral';
        this.aiApiKey = apiKey;
        this.httpRequest = this._createHttpClient();
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
    * Create a new HttpClient instance using the class constructor params
    * @private
    * @returns {HttpClient} A new HttpClient instance
    */
    _createHttpClient(){
        return new HttpClient('https://api.openai.com/v1', { 
            Authorization: `Bearer ${this.aiApiKey}`, 
            ...this.organizationIDs 
        });
    }

    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error){
        const errorMsg = error.response 
            ? `${this.aiName.toUpperCase()} ERROR => ${error.status} - ${error.response.data.error.message}` 
            : `Unexpected request error`;
        this.httpRequest.throwError(errorMsg);
    }
}

module.exports = MistralClient;