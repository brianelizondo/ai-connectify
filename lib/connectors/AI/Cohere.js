/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
const AIConnectifyError = require('../../AIConnectifyError');
const co = require('cohere-ai');

/**
* Represents a Cohere AI instance.
* Given a prompt, the model generates realistic text conditioned on a given inpute.
* @param {string} apiKey - The Cohere API key.
* @throws {AIConnectifyError} - Will throw an error if apiKey is not provided.
*/
class Cohere {
    constructor(apiKey) {
        if (!apiKey) {
            throw new AIConnectifyError('API key is required for Cohere');
        }

        this.config = {
            num_generations: 1,
            max_tokens: 20,
            truncate: "END",
            temperature: 0.75,
            k: 0,
            p: 0,
            return_likelihoods: "NONE"
        }
        co.init(apiKey);
        this.co = co;

        this.mergeConfigs = (newConfig) => {
            return { ...this.config, ...newConfig };
        }
    }

    
}

module.exports = Cohere;