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
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');
const HttpClient = require('../../HttpClient/HttpClient');

/**
* Represents a service for interacting with the Stability API
* @class StabilityClient
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
        this.createHttpClient();
    }


    /** 
    * createHttpClient
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(){
        this.httpRequest = new HttpClient('https://api.stability.ai/v2beta', { Authorization: `Bearer ${this.aiApiKey}`, ...this.clientData });
    }
    /** 
    * setClientId
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        ValidationHelpers.validateKeyString(clientID, `A valid client ID must be provided`);
        this.clientData['stability-client-id'] = clientID;
        this.createHttpClient();
    }
    /** 
    * setClientUserId
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        ValidationHelpers.validateKeyString(userID, `A valid user ID must be provided`);
        this.clientData['stability-client-user-id'] = userID;
        this.createHttpClient();
    }
    /** 
    * setClientVersion
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        ValidationHelpers.validateKeyString(clientVersion, `A valid client version must be provided`);
        this.clientData['stability-client-version'] = clientVersion;
        this.createHttpClient();
    }
    /**
    * throwError
    * Throw a formatted AIConnectifyError with the AI service and error message.
    * @param {Object} error - The error object caught during the request.
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description.
    */
    throwError(error){
        const errorMsg = error.response ? error.response.data.error.message : error.message;
        throw new AIConnectifyError(`${this.aiName} error => ${errorMsg}`);
    }

}

module.exports = StabilityClient;