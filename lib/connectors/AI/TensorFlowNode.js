'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import * as tf from '@tensorflow/tfjs-node';

class TensorFlowNode {
    constructor() {
        this.model = null; 
        this.modelPath = null;
    }

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