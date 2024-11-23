import classify from '../../../../lib/connectors/AI/Cohere/methods/classify';

describe("Cohere - classify method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const inputs = ["Confirm your email address", "hey i need u to send some $"];
    const examples = [
        {"text": "Dermatologists don't like her!","label": "Spam"},
        {"text": "I need help please wire me $1000 right now","label": "Spam"} 
    ];
    const modelId = 'model-test-id';
    const config = { truncate: "NONE" };
    
    beforeEach(() => {
        httpRequestMock = {
            post: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a POST request to the correct endpoint', async () => {
            const expectedResponse = {
                id: "id-test-response",
                classifications: [{
                    "id": "842d12fe-934b-4b71-82c2-c581eca00718",
                    "predictions": [ "Not spam" ],
                    "confidences": [ 0.5661598 ],
                    "labels": {
                        "Not spam": {
                            "confidence": 0.5661598
                        },
                        "Spam": { "confidence": 0.43384025 }
                    },
                    "classification_type": "single-label",
                    "input": "Confirm your email address",
                    "prediction": "Not spam",
                    "confidence": 0.5661598
                }]
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await classify(httpRequestMock, throwErrorMock, inputs, examples, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/classify',
                expect.objectContaining({
                    ...config, 
                    inputs: inputs, 
                    examples: examples,
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when inputs is not provided', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the imputs array');
        });
        it('Test when inputs is empty array', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the imputs array');
        });
        it('Test when inputs is not an array', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });

        it('Test when model ID is not provided', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, inputs, examples, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, inputs, examples, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, inputs, examples, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        it('Test when examples is not an array', async () => {
            await expect(
                classify(httpRequestMock, throwErrorMock, inputs, "[]", modelId)
            ).rejects.toThrow('This is not an array');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'API request error'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await classify(httpRequestMock, throwErrorMock, inputs, examples, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await classify(httpRequestMock, throwErrorMock, inputs, examples, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});