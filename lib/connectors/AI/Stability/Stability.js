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
const StabilityClient = require('./StabilityClient');
const AIConnectifyError = require('../../../AIConnectifyError');
const ValidationHelpers = require('../../../helpers/validationHelpers');

/**
* Represents a Stability AI instance.
* Handles interaction with the Stability API for chat, completions, edits, and model information.
* @class ChatGPT
*/
class Stability {
    /**
    * Create a Stability instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey) {
        ValidationHelpers.validateKeyString(apiKey, 'A valid API key must be provided');
        
        // Initialize StabilityClient with API key
        this.client = new StabilityClient(apiKey);
    }

    /** 
    * setClientId
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID){
        this.client.setClientId(clientID);
    }
    /** 
    * setClientUserId
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID){
        this.client.setClientUserId(userID);
    }
    /** 
    * setClientVersion
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion){
        this.client.setClientVersion(clientVersion);
    }
    
}

module.exports = Stability;