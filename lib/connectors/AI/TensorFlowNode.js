/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
const tf = require('@tensorflow/tfjs-node');

/**
* Represents a TensorFlow AI instance.
* @constructor
*/
class TensorFlowNode {
    constructor() {
        this.tf = tf;
    }
}

module.exports = TensorFlowNode;