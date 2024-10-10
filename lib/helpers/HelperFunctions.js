/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const fs = require('fs');
const path = require('path');
const AIConnectifyError = require('../AIConnectifyError');

/**
* Represents a HelperFunctions instance
* A collection of utility methods for input validation
* @class HelperFunctions
*/
class HelperFunctions {
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
    * Validates a number input to ensure it is not empty or NaN
    * @static
    * @param {number} inputNumber - The input number to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateNumberInput(inputNumber, errorMessage) {
        if(!inputNumber || typeof inputNumber !== 'number' || !Number.isFinite(inputNumber)) {
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

        const regex = /^[A-Za-z0-9-_.+=]{16,256}$/;
        if(!regex.test(keyString)){
            throw new AIConnectifyError(errorMessage);
        }
    }

    /** 
    * Validates if the value is boolean
    * @static
    * @param {string} value - The value to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateBooleanInput(value, errorMessage) {
        if(typeof value !== 'boolean'){
            throw new AIConnectifyError(errorMessage);
        }
    }

    /**
    * Generate a random ID
    * @static
    * @returns {string} - Random ID generated
    */
    static generateRandomID(){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        let idGenerated = '';
        for(let i=0; i<16; i++) {
            const randomIdx = Math.floor(Math.random() * chars.length);
            idGenerated += chars.charAt(randomIdx);
        }
        return idGenerated;
    }

    /** 
    * Validate and clean up a directory path
    * @static
    * @param {string} directory - The value to validate and clean
    * @param {string} variableName - The variable value to validate the path en return
    * @returns {string} - Directory path validated
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateAndReturnPath(directoryPath, variableName) {
        // validate if the path is a string
        this.validateStringInput(directoryPath, `Cannot process the ${variableName}`)

        // root directory
        const rootDir = process.cwd();

        let finalPath;
        const cleanedDirectoryPath = directoryPath.trim();
        const pathWithoutTrailingSlash = cleanedDirectoryPath.replace(/\/+$/, '');
        const lastChar = pathWithoutTrailingSlash.charAt(pathWithoutTrailingSlash.length - 1);
        if (lastChar !== '/' && lastChar !== '\\') {
            finalPath = pathWithoutTrailingSlash;
        } else {
            finalPath = pathWithoutTrailingSlash.slice(0, -1);
        }

        const finalDirectoryPath = path.normalize(`${rootDir}/${finalPath}`);        
        if (fs.existsSync(finalDirectoryPath)) {
            const projectName = rootDir.split('/').pop();
            const finalDirectoryFolders = finalDirectoryPath.split('/');
            const projectNameIndex = finalDirectoryFolders.indexOf(projectName);
            const approvedPath = finalDirectoryFolders.slice(projectNameIndex+1).join('/');
            
            return approvedPath;
        }else{
            throw new AIConnectifyError(`The '${variableName}' path is invalid or don't exists`);
        }
    }
}

module.exports = HelperFunctions;