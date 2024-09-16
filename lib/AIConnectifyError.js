/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Create an Error with the specified message, config, error code, request and response
* Represents an error that occurred in AIConnectify
* @class AIConnectifyError
* @extends Error
*/
class AIConnectifyError extends Error {
    /**
    * Create an Error with the specified message
    * @constructor
    * @param {string} message - The error message
    */
    constructor(message) {
        super(message);
        this.name = 'AIConnectifyError';
    }
}
  
module.exports = AIConnectifyError;