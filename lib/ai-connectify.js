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
* Create an instance of AI-Connectify
*/
class AIConnectify {
    constructor(ai, apiKey) {
        if (!ai) {
            throw new AIConnectifyError('You must specify an AI to use');
        }

        this.connector = getAIInstance(ai, apiKey);
    }
}

export default AIConnectify;