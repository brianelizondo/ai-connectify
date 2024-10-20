/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* @module ClaudeClient
*/
/**
* Module and dependencies
*/
const fs = require('fs');
const path = require('path');
const HelperFunctions = require('../../../helpers/HelperFunctions');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Claude API
* @class
*/
class ClaudeClient {
    /**
    * Create a Claude service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'Claude';
        this.aiApiKey = apiKey;
        this.anthropicVersion = "2023-06-01";
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
        return new HttpClient('https://api.anthropic.com/v1', { 
            'x-api-key': this.aiApiKey, 
            'anthropic-version': this.anthropicVersion
        });
    }

    /** 
    * Set the anthropic-version request header
    * @param {string} version - The anthropic-version request header
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setAnthropicVersion(version){
        HelperFunctions.validateStringInput(version, 'The version is required to set the new anthropic-version request header');
        
        this.anthropicVersion = version;
        this.httpRequest = this._createHttpClient();
    }
    
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error){
        const errorMsg = error.response 
            ? `${this.aiName.toUpperCase()} ERROR => ${error.status} - ${error.response.error.message}` 
            : `Unexpected request error`;
        this.httpRequest.throwError(errorMsg);
    }
}

module.exports = ClaudeClient;