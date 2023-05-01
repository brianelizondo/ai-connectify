/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Modules and dependencies
*/
import AIConnectifyError from './AIConnectifyError';
import { getAIInstance } from './connectors/AIConnectifyFactory';

/**
* The main AI-Connectify class for creating instances of different AI connectors
* @class AIConnectify
* @param {string} ai - The name of the AI connector to use
* @param {string|null} apiKey - The API key to use (if required by the AI connector)
* @throws {AIConnectifyError} - If the ai parameter is not provided
*/
class AIConnectify {
    constructor(ai, apiKey = null) {
        if (!ai) {
            throw new AIConnectifyError('You must specify an AI to use');
        }

        /**
        * The connector instance used by the AI-Connectify object
        * @type {Object}
        */
        this.connector = getAIInstance(ai, apiKey);
    }
}

export default AIConnectify;