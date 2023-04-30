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

/**
* Create an instance of AI-Connectify
*/
class AIConnectify {
    constructor(ai, apiKey) {
        this.ai = ai;
        this.apiKey = apiKey;
    }
}

export default AIConnectify;