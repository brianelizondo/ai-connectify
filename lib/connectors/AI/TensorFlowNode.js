'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import * as tf from '@tensorflow/tfjs-node';

class TensorFlowNode {
    constructor(model = null) {
        this.model = model;
    }

    async loadModel(modelPath = null) {
        if(!modelPath) {
            throw new AIConnectifyError('You must specify a model to use');
        }

        try {
            const model = await tf.loadLayersModel(`file://${modelPath}`);
            this.model = model;
            return model;
        } catch (error) {
            throw new AIConnectifyError(`Unable to load model from path ${modelPath}: ${error.message}`);
        }
    }
    
    async predict(inputData, newModel = null) {
        if(!this.model && !newModel) {
            throw new AIConnectifyError('The model must be loaded or selected before making predictions');
        }
        if(newModel){
            const model = await tf.loadLayersModel(`file://${modelPath}`);
            this.model = model;
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