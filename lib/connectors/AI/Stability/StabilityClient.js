/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* @module StabilityClient
*/
/**
* Module and dependencies
*/
const fs = require('fs');
const path = require('path');
const HelperFunctions = require('../../../helpers/HelperFunctions');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Stability API
* @class 
*/
class StabilityClient {
    /**
    * Create a Stability service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey) {
        this.aiName = 'Stability';
        this.aiApiKey = apiKey;
        this.clientData = {};
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
        const httpClient = new HttpClient('https://api.stability.ai/v2beta', { 
            common: { 
                'Content-Type': 'multipart/form-data'
            },
            'Authorization': `Bearer ${this.aiApiKey}`, 
            'Content-Type': 'multipart/form-data',
            ...this.clientData 
        });
        httpClient.client.defaults.validateStatus = null;
        httpClient.client.defaults.transformResponse = [(data, headers) => {
            if (headers['content-type']?.includes('application/json')) {
                return JSON.parse(Buffer.from(data).toString());
            }
            return data;
        }];
        return httpClient;
    }
    /** 
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        HelperFunctions.validateKeyString(clientID, `A valid client ID must be provided`);
        this.clientData['stability-client-id'] = clientID;
        this.httpRequest = this._createHttpClient();
    }
    /** 
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        HelperFunctions.validateKeyString(userID, `A valid user ID must be provided`);
        this.clientData['stability-client-user-id'] = userID;
        this.httpRequest = this._createHttpClient();
    }
    /** 
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        HelperFunctions.validateKeyString(clientVersion, `A valid client version must be provided`);
        this.clientData['stability-client-version'] = clientVersion;
        this.httpRequest = this._createHttpClient();
    }
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error){
        let errorMsg;
        if(error.hasOwnProperty("response")){
            errorMsg = `${error.status} - ${error.response.data.error.message}`;
        }else{
            errorMsg = `Unexpected request error - ${error.data.errors[0]}`;
        }
        
        this.httpRequest.throwError(`${this.aiName.toUpperCase()} ERROR => ${errorMsg}`);
    }

}

module.exports = StabilityClient;