export = TensorFlowClient;
/**
* Represents a service for interacting with the TensorFlow API
* @class TensorFlowClient
*/
declare class TensorFlowClient {
    aiName: string;
    tf: typeof import("@tensorflow/tfjs-node");
}
