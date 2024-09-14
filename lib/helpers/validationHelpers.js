/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const AIConnectifyError = require('../AIConnectifyError');

/**
* Represents a ValidationHelpers instance
* A collection of utility methods for input validation
* @class ValidationHelpers
*/
class ValidationHelpers {
    /**
    * Validates a string input to ensure it is not empty or whitespace-only
    * @static
    * @param {string} inputString - The input string to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateStringInput(inputString, errorMessage) {
        if(!inputString || typeof inputString !== 'string' || !inputString.trim()) {
            throw new AIConnectifyError(errorMessage);
        }
    }

    /**
    * Validates an array input to ensure it is not empty and is an actual array
    * @static
    * @param {Array} inputArray - The input array to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateArrayInput(inputArray, errorMessage){
        if (!inputArray || inputArray.length == 0){
            throw new AIConnectifyError(errorMessage);
        }else if (!Array.isArray(inputArray)){
            throw new AIConnectifyError('This is not an array');
        }
    }

    /** 
    * Validates an string to ensure it is a valid Key format
    * @static
    * @param {string} keyString - The key string to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateKeyString(keyString, errorMessage) {
        this.validateStringInput(keyString, errorMessage);

        const regex = /^[A-Za-z0-9-_.+=]{16,128}$/;
        if(!regex.test(keyString)){
            throw new AIConnectifyError(errorMessage);
        }
    }
}

module.exports = ValidationHelpers;