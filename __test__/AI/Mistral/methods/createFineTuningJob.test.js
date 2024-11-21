import createFineTuningJob from '../../../../lib/connectors/AI/Mistral/methods/createFineTuningJob';

describe("Mistral - createFineTuningJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const hyperparameters = {
        training_steps: 1,
        learning_rate: 0.0001,
        weight_decay: 0.1,
        warmup_fraction: 0.05,
        epochs: 0,
        fim_ratio: 0.9,
        seq_len: 100
    };
    const modelId = 'model-test-id';
    const config = { auto_start: true };
    
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
                object: "chat.completion",
                model: modelId
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createFineTuningJob(httpRequestMock, throwErrorMock, hyperparameters, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/fine_tuning/jobs',
                expect.objectContaining({
                    ...config, 
                    hyperparameters: hyperparameters, 
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when model ID is not provided', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the model ID');
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

            await createFineTuningJob(httpRequestMock, throwErrorMock, hyperparameters, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createFineTuningJob(httpRequestMock, throwErrorMock, hyperparameters, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});