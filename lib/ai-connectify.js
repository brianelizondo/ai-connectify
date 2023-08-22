/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Modules and dependencies
* @module AIConnectify
*/
const AIConnectifyError = require('./AIConnectifyError');
const getAIInstance = require('./connectors/AIConnectifyFactory');

/**
* The main AI-Connectify class for creating instances of different AI connectors
* @class AIConnectify
*/
class AIConnectify {
    /**
    * Creates an instance of AIConnectify
    * @constructor
    * @param {string} ai - The name of the AI connector to use (e.g. 'TensorFlowNode', 'ChatGPT', 'DALLE')
    * @param {string|null} [apiKey=null] - The API key to use (if required by the AI connector)
    * @throws {AIConnectifyError} - If the ai parameter is not provided
    */
    constructor(ai, apiKey = null) {
        if (!ai) {
            throw new AIConnectifyError('You must specify an AI to use');
        }

        /**
        * The connector instance used by the AI-Connectify object
        * @member {object} connector
        */
        this.connector = getAIInstance(ai, apiKey);
    }
}

module.exports = AIConnectify;