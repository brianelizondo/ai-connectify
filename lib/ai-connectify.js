/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Modules and dependencies
*/
const AIConnectifyError = require('./AIConnectifyError');
const AIConnectifyFactory = require('./connectors/AIConnectifyFactory');

/**
* The main AI-Connectify class for creating instances of different AI connectors
* @class
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
        if(!ai) {
            throw new AIConnectifyError('You must specify an AI to use');
        }

        /**
        * The connector instance used by the AI-Connectify object
        * @member {object} connector
        */
        this.connector = AIConnectifyFactory.createAIInstance(ai, apiKey);
    }

    /**
    * Proxy method to call functions from the connector instance
    * @param {string} methodName - The method to call on the connector
    * @param  {...any} args - The arguments to pass to the method
    * @returns {Promise} - The result of the method call
    */
    async call(methodName, ...args) {
        if (typeof this.connector[methodName] !== 'function') {
            throw new AIConnectifyError(`Method ${methodName} does not exist on the connector`);
        }
        return this.connector[methodName](...args);
    }
}

module.exports = AIConnectify;