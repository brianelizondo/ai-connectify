import AIConnectifyError from '../../lib/AIConnectifyError';
import TensorFlowNode from '../../lib/connectors/AI/TensorFlowNode';

const tfNode = new TensorFlowNode().tf;

describe("TensorFlow AI class", () => { 
    describe("Successful test cases", () => { 
        it("Tests if tensor method returns a tensor object", async () => {
            const newTensor = await tfNode.tensor([1, 2, 3, 4]);
            expect(newTensor).toEqual(expect.any(Object));
            expect(newTensor.size).toEqual(4);
        });

        it("Tests if tensor1d method returns a tensor1d object", async () => {
            const newTensor = await tfNode.tensor1d([1, 2, 3]);
            expect(newTensor).toEqual(expect.any(Object));
            expect(newTensor.size).toEqual(expect.any(Number));
        });

        it("Tests if buffer method returns a buffer object", async () => {
            const newBuffer = tfNode.buffer([2, 2]);
            newBuffer.set(3, 0, 0);
            newBuffer.set(5, 1, 0);
            newBuffer.toTensor();
            expect(newBuffer).toEqual(expect.any(Object));
            expect(newBuffer.size).toEqual(4);
        });
    
        it("Tests if model sequential method returns a model sequential object", async () => {
            const newModel = tfNode.sequential();
            newModel.add(tfNode.layers.dense({units: 32, inputShape: [50]}));
            newModel.add(tfNode.layers.dense({units: 4}));
            const inspectModel = newModel.outputs[0].shape;
    
            expect(inspectModel).toEqual(expect.any(Array));
            expect(inspectModel[0]).toEqual(null);
            expect(inspectModel[1]).toEqual(expect.any(Number));
        });
    
        it("Tests if model method returns a model object", async () => {
            const input = tfNode.input({shape: [5]});
            const denseLayer1 = tfNode.layers.dense({units: 10, activation: 'relu'});
            const denseLayer2 = tfNode.layers.dense({units: 4, activation: 'softmax'});
            const output = denseLayer2.apply(denseLayer1.apply(input));
            const newModel = tfNode.model({inputs: input, outputs: output});
            const predictModel = newModel.predict(tfNode.ones([2, 5]));
            
            expect(predictModel).toEqual(expect.any(Object));
            expect(predictModel.shape).toEqual([2,4]);
            expect(predictModel.size).toEqual(expect.any(Number));
        });
    });

    describe("AIConnectifyError is throw in methods", () => { 
        it("Tests is thrown error in a function when the argument is not provided", async () => {
            try {
                await tfNode.tensor();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual(expect.any(String));
            }
        });
    });
});
