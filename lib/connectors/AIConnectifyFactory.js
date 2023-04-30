'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../AIConnectifyError';

import TensorFlowNode from './AI/TensorFlowNode';
import ChatGPT from './AI/ChatGPT';
import DALLE from './AI/DALLE';

/**
* Returns an instance of the AI connector for the specified AI
*
* @param {string} ai The name of the AI to use (e.g. 'tensorflow', 'chatgpt', 'dalle')
* @param {string} apiKey The API key required for some AI (e.g. 'chatgpt', 'dalle')
* @returns {object} An instance of the AI connector
* @throws {AIConnectifyError} Throws an error if an unsupported AI is specified
*/
function getAIInstance(ai, apiKey) {
    switch (ai) {
        case 'TensorFlowNode':
            return new TensorFlowNode();
        case 'ChatGPT':
            if (!apiKey) {
                throw new AIConnectifyError('API key is required for ChatGPT');
            }
            return new ChatGPT(apiKey);
        case 'DALL-E':
            if (!apiKey) {
                throw new AIConnectifyError('API key is required for DALL-E');
            }
            return new DALLE(apiKey);
        default:
            throw new AIConnectifyError('You must specify an AI to use');
    }
}

export { getAIInstance };