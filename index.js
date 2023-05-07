/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* AI-Connectify is a library that allows users to interact with various AI models using different APIs. 
* Currently supported models include TensorFlow Node, ChatGPT and DALL-E.
* @module AIConnectify
*/
const AIConnectify = require('./lib/ai-connectify');

// this module should only have a default export
module.exports = AIConnectify;