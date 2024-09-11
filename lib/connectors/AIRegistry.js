/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
* @module AIRegistry
*/
const fs = require('fs');
const path = require('path');
const AIConnectifyError = require('../AIConnectifyError');

/**
* AIRegistry class
* This class dynamically loads AI connectors from the 'AI' directory and registers them
* It provides methods to register AIs and retrieve registered AIs
*/
class AIRegistry {
    constructor() {
        this.registeredAIs = {};
        this.loadAIs();
    }

    /**
    * Register an AI class with its name and whether it requires an API key
    * @param {string} aiName - The name of the AI
    * @param {class} AIClass - The class representing the AI service
    * @param {boolean} apiKeyRequired - Whether this AI requires an API key
    */
    registerAI(aiName, AIClass, apiKeyRequired){
        this.registeredAIs[aiName] = {
            aiInstance: AIClass,
            apiKeyRequired: apiKeyRequired
        };
    }

    /**
    * Loads and registers all AI modules from the AI directory
    * This method dynamically reads subdirectories in the 'AI' folder, where each subdirectory represents an AI service
    * For each AI, it attempts to load the main class file and the config file
    */
    loadAIs(){
        // Set the AI connectors directory to find all AI services
        const aiConnectorsDirectory = path.resolve(__dirname, 'AI');

        // Ensure the AI directory exists
        if (!fs.existsSync(aiConnectorsDirectory)) {
            throw new AIConnectifyError('AI connectors directory not found');
        }
        
        // Read all subdirectories in the AI directory
        fs.readdirSync(aiConnectorsDirectory, { withFileTypes: true }).forEach(directory => {
            const aiName = directory.name;
            const aiDirectoryPath = `${aiConnectorsDirectory}/${aiName}`;

            if(directory.isDirectory() && fs.existsSync(aiDirectoryPath)){
                try {
                    // Require the AI class file and its config
                    const aiClass = require(`${aiDirectoryPath}/${aiName}`);
                    const aiConfig = require(`${aiDirectoryPath}/config`);

                    // Check if apiKeyRequired exists in config
                    if (!aiConfig || typeof aiConfig.apiKeyRequired !== 'boolean') {
                        throw new AIConnectifyError(`Invalid or missing config for ${aiName} service`);
                    }

                    // Register the AI with its class and apiKeyRequired flag
                    this.registerAI(aiName, aiClass, aiConfig.apiKeyRequired);
                } catch (error) {
                    throw new AIConnectifyError(`Failed to load AI module ${aiName}: ${error.message}`);
                }
            }
        });
    }

    /**
    * Retrieves the registered AI class and its API key requirement.
    * @param {string} aiName - The name of the AI to retrieve.
    * @returns {object} - The AI class and its API key requirement status.
    * @throws {AIConnectifyError} - Throws an error if the AI is not registered.
    */
    getAI(aiName){
        const ai = this.registeredAIs[aiName];
        if(!ai) {
            throw new AIConnectifyError(`AI service ${aiName} is not registered`);
        }
        return ai;
    }
}

module.exports = new AIRegistry();