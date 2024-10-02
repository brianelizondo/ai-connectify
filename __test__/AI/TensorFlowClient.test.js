import TensorFlowClient  from '../../lib/connectors/AI/TensorFlow/TensorFlowClient';

jest.mock('@tensorflow/tfjs-node', () => ({
    tensor: jest.fn(),
    matMul: jest.fn(),
    sum: jest.fn(),
}));

describe('TensorFlowClient class', () => {
    let client;

    beforeEach(() => {
        client = new TensorFlowClient();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(client).toBeInstanceOf(TensorFlowClient);
        });
        it("Test that the expected properties are present", () => {
            expect(client.aiName).toBe('TensorFlow');
            expect(client.tf).toBeDefined();
        });
        it("Test that expected methods are present", () => {
            expect(typeof client.tf.tensor).toBe('function');
            expect(typeof client.tf.matMul).toBe('function');
            expect(typeof client.tf.sum).toBe('function');
        });
        it("Test that there are no unexpected properties", () => {
            const ownProperties = Object.getOwnPropertyNames(client);
            const expectedProperties = ['aiName', 'tf'];
            expectedProperties.forEach(prop => {
                expect(ownProperties).toContain(prop);
            });
        });
        it("Test that there are no unexpected additional properties", () => {
            const ownProperties = Object.getOwnPropertyNames(client);
            const expectedProperties = ['aiName', 'tf'];
            const unexpectedProperties = ownProperties.filter(prop => !expectedProperties.includes(prop));
            expect(unexpectedProperties).toHaveLength(0);
        });
        it("Test that @tensorflow/tfjs-node has been imported", () => {
            expect(require('@tensorflow/tfjs-node')).toBeDefined();
        });
    });
    describe("Use the methods individually", () => {
        it("Test being initialize with the correct AI name", () => {
            expect(client.aiName).toBe('TensorFlow');
        });
        
        it("Test being have a tf property with TensorFlow methods", () => {
            expect(client.tf).toBeDefined();
            expect(client.tf.tensor).toBeDefined();
            expect(client.tf.matMul).toBeDefined();
            expect(client.tf.sum).toBeDefined();
        });
    
        it("Test being able to call TensorFlow methods", () => {
            const mockTensor = { data: [1, 2, 3] };
            client.tf.tensor.mockReturnValue(mockTensor);
        
            const result = client.tf.tensor([1, 2, 3]);
            expect(result).toBe(mockTensor);
            expect(client.tf.tensor).toHaveBeenCalledWith([1, 2, 3]);
        });
    });
});