/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import * as tf from '@tensorflow/tfjs-node';

/**
* Represents a TensorFlow AI instance.
* @constructor
*/
class TensorFlowNode {
    constructor() {
        this.model = null; 
        this.modelPath = null;
    }

    /**
    * Loads a TensorFlowNode model from the specified path.
    * @async
    * @param {string} modelPath The path to the TensorFlow model.
    * @returns {object} The loaded TensorFlowNode model.
    * @throws {AIConnectifyError} Throws an error if the model path is not specified or if the model fails to load.
    */
    async loadModel(modelPath = null) {
        if(!modelPath){
            throw new AIConnectifyError('You must specify a model to use');
        }

        try {
            const model = await tf.loadLayersModel(modelPath);
            this.model = model;
            this.modelPath = modelPath;
            return model;
        } catch (error) {
            throw new AIConnectifyError(`Unable to load model from path ${modelPath}: ${error.message}`);
        }
    }
    
    /**
    * Makes a prediction using the loaded TensorFlow model.
    * @async
    * @param {Array} inputData The input data to use for the prediction.
    * @returns {Array} The predicted output.
    * @throws {AIConnectifyError} Throws an error if the input data is not specified, if the model is not loaded, or if the prediction fails.
    */
    async predict(inputData) {
        if(!inputData){
            throw new AIConnectifyError('You must specify the input data to use');
        }
        if(!this.modelPath){
            throw new AIConnectifyError('The model must be loaded before making predictions');
        }
        
        try {
            const inputTensor = tf.tensor(inputData);
            const outputTensor = await model.predict(inputTensor);
            return outputTensor.dataSync();
        } catch (error) {
            console.error(`Error during prediction: ${error}`);
            throw new AIConnectifyError(`Error during prediction: ${error.message}`);
        }
    }
}

export default TensorFlowNode;