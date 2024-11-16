import TensorFlow from '../../../lib/connectors/AI/TensorFlow/TensorFlow';
import TensorFlowClient from '../../../lib/connectors/AI/TensorFlow/TensorFlowClient';

jest.mock('../../../lib/connectors/AI/TensorFlow/TensorFlowClient');

describe("TensorFlow class", () => { 
    let tensorflow;
    let mockTfMethods;

    beforeEach(() => {
        mockTfMethods = {
            tensor: jest.fn(),
            matMul: jest.fn(),
            sum: jest.fn(),
        };
    
        TensorFlowClient.mockImplementation(() => ({
            tf: mockTfMethods
        }));
      
        tensorflow = new TensorFlow();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(tensorflow).toBeInstanceOf(TensorFlow);
            expect(TensorFlowClient).toHaveBeenCalledTimes(1);
        });
        it("Test that expected methods are present", () => {
            expect(typeof tensorflow.tensor).toBe('function');
            expect(typeof tensorflow.matMul).toBe('function');
            expect(typeof tensorflow.sum).toBe('function');
        });
        it("Test that there are no unexpected properties", () => {
            const ownProperties = Object.getOwnPropertyNames(tensorflow);
            const expectedProperties = ['tensor', 'matMul', 'sum'];
            expectedProperties.forEach(prop => {
                expect(ownProperties).toContain(prop);
            });
        });
        it("Test that there are no unexpected additional methods", () => {
            const ownProperties = Object.getOwnPropertyNames(tensorflow);
            const expectedProperties = ['tensor', 'matMul', 'sum'];
            const unexpectedProperties = ownProperties.filter(prop => !expectedProperties.includes(prop) && typeof tensorflow[prop] === 'function');
            expect(unexpectedProperties).toHaveLength(0);
        });
        
    });
    describe("Use the methods individually", () => {
        it("Test being bind all TensorFlowClient methods", () => {
            expect(tensorflow.tensor).toBeDefined();
            expect(tensorflow.matMul).toBeDefined();
            expect(tensorflow.sum).toBeDefined();
        });
        
        it("Test being able to call TensorFlowClient methods directly", () => {
            const mockTensor = { data: [1, 2, 3] };
            mockTfMethods.tensor.mockReturnValue(mockTensor);
        
            const result = tensorflow.tensor([1, 2, 3]);
            expect(result).toBe(mockTensor);
            expect(mockTfMethods.tensor).toHaveBeenCalledWith([1, 2, 3]);
        });
        
        it("Test being maintain the correct context when calling bound methods", () => {
            tensorflow.matMul('a', 'b');
            expect(mockTfMethods.matMul).toHaveBeenCalledWith('a', 'b');
        });
    });
});
