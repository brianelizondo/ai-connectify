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
const TensorFlowClient = require('./TensorFlowClient');

/**
* Represents a TensorFlow AI instance.
* @class TensorFlow
*/
class TensorFlow {
    /**
    * Create a TensorFlow AI instance.
    * @constructor
    */
    constructor() {
        // Initialize TensorFlowClient
        this.tf = new TensorFlowClient().tf;
    }
}

module.exports = TensorFlow;