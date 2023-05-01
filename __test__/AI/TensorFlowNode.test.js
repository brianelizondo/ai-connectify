import AIConnectifyError from '../../lib/AIConnectifyError';
import TensorFlowNode from '../../lib/connectors/AI/TensorFlowNode';

const tfNode = new TensorFlowNode();


describe("AIConnectifyError is throw in TensorFlowNode AI class", () => {
    it("Tests is thrown error in loadModel function when the model is not provided", async () => {
        await expect(tfNode.loadModel()).rejects.toThrow(AIConnectifyError);
        await expect(tfNode.loadModel()).rejects.toThrow('You must specify a model to use');
    });
    it("Tests is thrown error in predict function when the input data is empty", async () => {
        await expect(tfNode.predict()).rejects.toThrow(AIConnectifyError);
        await expect(tfNode.predict()).rejects.toThrow('You must specify the input data to use');
    });
    it("Tests is thrown error in predict function if the model is empty or null", async () => {
        await expect(tfNode.loadModel()).rejects.toThrow(AIConnectifyError);
        await expect(tfNode.loadModel()).rejects.toThrow('You must specify a model to use');
    });
});