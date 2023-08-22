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
const tf = require('@tensorflow/tfjs-node');

/**
* Represents a TensorFlow AI instance.
* @class TensorFlowNode
*/
class TensorFlowNode {
    /**
    * Create a TensorFlow AI instance.
    * @constructor
    */
    constructor() {
        this.tf = tf;
    }
}

module.exports = TensorFlowNode;