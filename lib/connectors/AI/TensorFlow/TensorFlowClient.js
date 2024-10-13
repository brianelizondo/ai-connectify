/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* @module TensorFlowClient
*/
/**
* Represents a service for interacting with the TensorFlow API
* @class 
*/
class TensorFlowClient {
    /**
    * Create a TensorFlow service instance
    * @constructor
    * @throws {Error} If TensorFlow.js cannot be loaded
    */
    constructor() {
        this.aiName = 'TensorFlow';
        this.tf = require('@tensorflow/tfjs-node');

    }

}

module.exports = TensorFlowClient;