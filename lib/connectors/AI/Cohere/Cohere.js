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
const CohereService = require('../../services/CohereService');

/**
* Represents a Cohere AI instance
* Given a prompt, the model   builds natural language processing and generation
* @class Cohere
*/
class Cohere {
    /**
    * Create a Cohere instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere API
    */
    constructor(apiKey) {
        // get a new service instance
        this.service = new CohereService(apiKey);
    }

    /**
    * MODELS METHODS
    * List and describe the various methods available in the API
    * Refer to the AI documentation to understand what methods/models are available and the differences between them
    * 
    * Generate
    * This generates realistic text conditioned on a given input
    * @async
    * @param {string} promptText - The input text that serves as the starting point for generating the response
    * @param {string} [model="command"] - The identifier of the model to generate with
    * @param {Object} [newConfig={}] - Optional parameters for the  generation
    * @returns {Promise<String>} - A Promise that return a text generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async generate(promptText, modelName = 'command', newConfig = {}){
        // Returns the corresponding method in the service client
        return this.service.generate(promptText, modelName, newConfig);
    }

    /**
    * Embed
    * This method returns text embeddings
    * An embedding is a list of floating point numbers that captures semantic information about the text that it represents
    * @async
    * @param {Array} textsArray - An array of strings for the model to embed. Maximum number of texts per call is 96
    * @param {string} [modelName="embed-english-v2.0"] - The identifier of the model
    * @param {string} [truncate="END"] - Optional parameters for the generation
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async embed(textsArray, modelName = "embed-english-v2.0", truncate = "END") {
        // Returns the corresponding method in the service client
        return this.service.embed(textsArray, modelName, truncate);
    }

    /**
    * Classify
    * This method returns a prediction about which label fits the specified text inputs best
    * @async
    * @param {Array} inputsArray - Represents a list of queries to be classified, each entry must not be empty. The maximum is 96 inputs
    * @param {Array} examplesArray - An array of examples to provide context to the model. Each example is a text string and its associated label/class
    *                                The values should be structured as { text: "...", label: "..." }
    * @param {string} [modelName="embed-english-v2.0"] - The identifier of the model
    * @param {Object} [newConfig={}] - Optional parameters for the  generation
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async classify(inputsArray, examplesArray, modelName = "embed-english-v2.0", newConfig = {}) {
        // Returns the corresponding method in the service client
        return this.service.classify(inputsArray, examplesArray, modelName, newConfig);
    }

    /**
    * Tokenize
    * This method splits input text into smaller units called tokens using byte-pair encoding (BPE)
    * @async
    * @param {String} textInput - The string to be tokenized, the minimum text length is 1 character, and the maximum text length is 65536 characters
    * @param {string} [modelName="command"] - The identifier of the model
    * @returns {Promise<Object>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async tokenize(textInput, modelName = "command") {
        // Returns the corresponding method in the service client
        return this.service.tokenize(textInput, modelName);
    }

    /**
    * Detokenize
    * This method takes tokens using byte-pair encoding and returns their text representation
    * @async
    * @param {Array} tokensArray - The list of tokens to be detokenized
    * @param {string} [modelName="command"] - The identifier of the model
    * @returns {Promise<String>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async detokenize(tokensArray, modelName = "command") {
        // Returns the corresponding method in the service client
        return this.service.detokenize(tokensArray, modelName);
    }

    /**
    * Detect Language
    * This method identifies which language each of the provided texts is written in
    * @async
    * @param {Array} textsArray - The list of tokens to be detokenized
    * @returns {Promise<Array>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async detectLanguage(textsArray) {
        // Returns the corresponding method in the service client
        return this.service.detectLanguage(textsArray);
    }

    /**
    * Summarize
    * This method returns a summary in English for a given text. 
    * @async
    * @param {string} promptText - Represents a text to generate a summary for. Can be up to 100,000 characters long
    * @param {string} [modelName="command"] - The identifier of the model
    * @param {Object} [newConfig={}] - Optional parameters for the  generation
    * @returns {Promise<string>} - A Promise that resolves with the generated
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    async summarize(promptText, modelName = "command", newConfig = {}) {
        // Returns the corresponding method in the service client
        return this.service.summarize(promptText, modelName, newConfig);
    }
}

module.exports = Cohere;