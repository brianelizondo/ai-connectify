export = TensorFlowClient;
/**
* @module TensorFlowClient
*/
/**
* Represents a service for interacting with the TensorFlow API
* @class
*/
declare class TensorFlowClient {
    aiName: string;
    tf: typeof import("@tensorflow/tfjs-node");
}
