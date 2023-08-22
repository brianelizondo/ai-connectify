/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Modules and dependencies
*/
const AIConnectifyError = require('../../AIConnectifyError');
const co = require('cohere-ai');

/**
* Represents a Cohere AI instance.
* Given a prompt, the model   builds natural language processing and generation.
* @param {string} apiKey - The Cohere API key.
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class Cohere {
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

        // Method to merge default and new configs
        this.mergeConfigs = (defaultConfig, newConfig) => {
            return { ...defaultConfig, ...newConfig };
        }
    }

    /**
    * MODELS METHODS
    * List and describe the various methods available in the API. 
    * Refer to the AI documentation to understand what methods/models are available and the differences between them
    * 
    * Generate
    * This generates realistic text conditioned on a given input.
    * @async
    * @param {string} promptText - The input text that serves as the starting point for generating the response.
    * @param {string} [model="command"] - The identifier of the model to generate with.
    * @param {Object} [newConfig={}] - Optional parameters for the  generation.
    * @returns {Promise<String>} - A Promise that return a text generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async generate(promptText, modelName = 'command', newConfig = {}){
        if (!promptText || typeof promptText !== 'string'){
            throw new AIConnectifyError('Cannot process an empty prompt');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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
    * This method returns text embeddings. 
    * An embedding is a list of floating point numbers that captures semantic information about the text that it represents.
    * @async
    * @param {Array} textsArray - An array of strings for the model to embed. Maximum number of texts per call is 96.
    * @param {string} [modelName="embed-english-v2.0"] - The identifier of the model.
    * @param {string} [truncate="END"] - Optional parameters for the generation.
    * @returns {Promise<Array>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async embed(textsArray, modelName = "embed-english-v2.0", truncate = "END") {
        if (!textsArray || textsArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty texts array');
        }else if (!Array.isArray(textsArray)){
            throw new AIConnectifyError('Cannot process a not array of texts');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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
    * This method returns a prediction about which label fits the specified text inputs best. 
    * @async
    * @param {Array} inputsArray - Represents a list of queries to be classified, each entry must not be empty. The maximum is 96 inputs.
    * @param {Array} examplesArray - An array of examples to provide context to the model. Each example is a text string and its associated label/class
    *                                The values should be structured as { text: "...", label: "..." }
    * @param {string} [modelName="embed-english-v2.0"] - The identifier of the model.
    * @param {string} [truncate="END"] - Optional parameters for the generation.
    * @returns {Promise<Array>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async classify(inputsArray, examplesArray, modelName = "embed-english-v2.0", newConfig = {}) {
        if (!inputsArray || inputsArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty inputs array');
        }else if (!Array.isArray(inputsArray)){
            throw new AIConnectifyError('Cannot process a not array of inputs');
        }
        if (!examplesArray || examplesArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty examples array');
        }else if (!Array.isArray(examplesArray)){
            throw new AIConnectifyError('Cannot process a not array of examples');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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
    * This method splits input text into smaller units called tokens using byte-pair encoding (BPE). 
    * @async
    * @param {String} textInput - The string to be tokenized, the minimum text length is 1 character, and the maximum text length is 65536 characters.
    * @param {string} [modelName="command"] - The identifier of the model.
    * @returns {Promise<Object>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async tokenize(textInput, modelName = "command") {
        if (!textInput || typeof textInput !== 'string'){
            throw new AIConnectifyError('Cannot process an empty text');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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
    * This method takes tokens using byte-pair encoding and returns their text representation.. 
    * @async
    * @param {Array} tokensArray - The list of tokens to be detokenized.
    * @param {string} [modelName="command"] - The identifier of the model.
    * @returns {Promise<String>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async detokenize(tokensArray, modelName = "command") {
        if (!tokensArray || tokensArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty tokens array');
        }else if (!Array.isArray(tokensArray)){
            throw new AIConnectifyError('Cannot process a not array of tokens');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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
    * This method identifies which language each of the provided texts is written in. 
    * @async
    * @param {Array} textsArray - The list of tokens to be detokenized.
    * @returns {Promise<Array>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async detectLanguage(textsArray) {
        if (!textsArray || textsArray.length == 0){
            throw new AIConnectifyError('Cannot process an empty texts array');
        }else if (!Array.isArray(textsArray)){
            throw new AIConnectifyError('Cannot process a not array of texts');
        }
        
        try {
            const response = await co.detectLanguage({ texts: textsArray });
            return response.body.results;
        } catch (error) {
            throw new AIConnectifyError(`Cohere error => ${error}`);
        }
    }

    /**
    * Summarize
    * This method returns a summary in English for a given text. 
    * @async
    * @param {String} promptText - Represents a text to generate a summary for. Can be up to 100,000 characters long.
    * @param {string} [modelName="command"] - The identifier of the model.
    * @param {Object} [newConfig={}] - Optional parameters for the  generation.
    * @returns {Promise<String>} - A Promise that resolves with the generated.
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation.
    */
    async summarize(promptText, modelName = "command", newConfig = {}) {
        if (!promptText || typeof promptText !== 'string'){
            throw new AIConnectifyError('Cannot process an empty text');
        }
        if (typeof modelName !== 'string'){
            throw new AIConnectifyError('Cannot process the model name');
        }
        
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

module.exports = Cohere;