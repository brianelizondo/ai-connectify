/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
* @module 
*/
const AIConnectifyError = require('../../../AIConnectifyError');

/**
* Represents a service for interacting with the TensorFlow API
* @class TensorFlowClient
*/
class TensorFlowClient {
    /**
    * Create a TensorFlow service instance
    * @constructor
    */
    constructor() {
        this.aiName = 'TensorFlow';
        this.tf = require('@tensorflow/tfjs-node');

    }

}

module.exports = TensorFlowClient;