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
const AIConnectifyError = require('../AIConnectifyError');
const ValidationHelpers = require('../helpers/validationHelpers');
const co = require('cohere-ai');

/**
* Represents a service for interacting with the Cohere API
* @class CohereService
*/
class CohereService {
    /**
    * Create a Cohere service instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere API
    */
    constructor(apiKey) {
        co.init(apiKey);
        this.co = co;

        // Set the methods default configuration
        this.generateDefaultConfig = {
            num_generations: 1,
            max_tokens: 20,
            truncate: "END",
            temperature: 0.75,
            k: 0,
            p: 0,
            return_likelihoods: "NONE"
        }
        this.classifyDefaultConfig = {
            truncate: "END"
        }
        this.summarizeDefaultConfig = {
            length: "medium",
            format: "paragraph",
            extractiveness: "low",
            temperature: 0
        }

        /**
        * Merge default and new configurations
        * @function
        * @param {Object} defaultConfig - Default configuration
        * @param {Object} newConfig - New configuration
        * @returns {Object} Merged configuration
        */
        this.mergeConfigs = (defaultConfig, newConfig) => {
            return { ...defaultConfig, ...newConfig };
        }
    }

    /**
    * SERVICES METHODS
    * 
    * Generate
    * @async
    * @param {string} promptText - The input text that serves as the starting point for generating the response
    * @param {string} model - The identifier of the model to generate with
    * @param {Object} newConfig - Optional parameters for the  generation
    * @returns {Promise<String>} - A Promise that return a text generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async generate(promptText, modelName, newConfig){
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
                
        try {
            const mergedConfig = this.mergeConfigs(this.generateDefaultConfig, newConfig);
            const response = await this.co.generate({
                prompt: promptText,
                model: modelName,
                ...mergedConfig
            });
            return response.body.generations[0].text;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${ error }`);
        }
    }

    /**
    * Embed
    * @async
    * @param {Array} textsArray - An array of strings for the model to embed. Maximum number of texts per call is 96
    * @param {string} modelName - The identifier of the model
    * @param {string} truncate - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async embed(textsArray, modelName, truncate) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(textsArray, 'Cannot process an empty texts array');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
        
        try {
            const response = await this.co.embed({
                texts: textsArray,
                model: modelName,
                truncate
            });
            return response.body.embeddings;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Classify
    * @async
    * @param {Array} inputsArray - Represents a list of queries to be classified, each entry must not be empty. The maximum is 96 inputs
    * @param {Array} examplesArray - An array of examples to provide context to the model. Each example is a text string and its associated label/class
    *                                The values should be structured as { text: "...", label: "..." }
    * @param {string} modelName - The identifier of the model
    * @param {string} truncate - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async classify(inputsArray, examplesArray, modelName, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(inputsArray, 'Cannot process an empty inputs array');
        ValidationHelpers.validateArrayInput(examplesArray, 'Cannot process an empty examples array');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
        
        try {
            const mergedConfig = this.mergeConfigs(this.classifyDefaultConfig, newConfig);
            const response = await co.classify({
                inputs: inputsArray,
                examples: examplesArray,
                model: modelName, 
                ...mergedConfig
            });
            return response.body.classifications;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Tokenize
    * @async
    * @param {String} textInput - The string to be tokenized, the minimum text length is 1 character, and the maximum text length is 65536 characters
    * @param {string} modelName - The identifier of the model
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async tokenize(textInput, modelName) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(textInput, 'Cannot process an empty text');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
        
        try {
            const response = await co.tokenize({
                text: textInput,
                model: modelName
            });
            return { tokens: response.body.tokens, token_strings: response.body.token_strings };
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Detokenize
    * @async
    * @param {Array} tokensArray - The list of tokens to be detokenized
    * @param {string} modelName - The identifier of the model
    * @returns {Promise<String>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async detokenize(tokensArray, modelName) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(tokensArray, 'Cannot process an empty tokens array');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
        
        try {
            const response = await co.detokenize({
                tokens: tokensArray,
                model: modelName
            });
            return response.body.text;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Detect Language
    * @async
    * @param {Array} textsArray - The list of tokens to be detokenized
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async detectLanguage(textsArray) {
        // Preview inputs validations
        ValidationHelpers.validateArrayInput(textsArray, 'Cannot process an empty text array');
        
        try {
            const response = await co.detectLanguage({ texts: textsArray });
            return response.body.results;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Summarize
    * @async
    * @param {string} promptText - Represents a text to generate a summary for. Can be up to 100,000 characters long
    * @param {string} modelName - The identifier of the model
    * @param {Object} newConfig - Optional parameters for the  generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async summarize(promptText, modelName, newConfig) {
        // Preview inputs validations
        ValidationHelpers.validateStringInput(promptText, 'Cannot process an empty prompt');
        ValidationHelpers.validateStringInput(modelName, 'Cannot process the model name');
        
        try {
            const mergedConfig = this.mergeConfigs(this.summarizeDefaultConfig, newConfig);
            const response = await co.summarize({
                text: promptText,
                model: modelName,
                ...mergedConfig
            });
            return response.body.summary;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }
}

module.exports = CohereService;