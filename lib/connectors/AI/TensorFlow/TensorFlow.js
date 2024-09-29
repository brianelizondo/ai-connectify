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
* Represents a TensorFlow AI instance
* @class TensorFlow
*/
class TensorFlow {
    /**
    * Create a TensorFlow AI instance
    * @constructor
    */
    constructor() {
        // Initialize TensorFlowClient
        // Bind all methods from TensorFlowClient to main class instance
        this._bindMethods();
    }

    /**
    * Binds all methods of TensorFlowClient to the current instance so that 
    * they can be called directly on the instance without referencing this.tf
    */
    _bindMethods() {
        const clientInstance = new TensorFlowClient().tf;
        // Iterate over all properties of this.tf
        for (const methodName of Object.keys(clientInstance)) {
            // If it's a function, bind it to the current instance
            if (typeof clientInstance[methodName] === 'function') {
                this[methodName] = clientInstance[methodName].bind(clientInstance);
            }
        }
    }
}

module.exports = TensorFlow;