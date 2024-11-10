import createFineTuningJob from '../../../../lib/connectors/AI/ChatGPT/methods/createFineTuningJob';

describe("ChatGPT - createFineTuningJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const fileId = 'file-123';
    const modelId = 'model-test-id';
    const config = { hyperparameters: { epochs: 3 } };
    
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
            const expectedResponse = { id: 'ft-job-123', status: 'created' };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createFineTuningJob(httpRequestMock, throwErrorMock, fileId, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/fine_tuning/jobs',
                expect.objectContaining({
                    training_file: fileId,
                    model: modelId,
                    hyperparameters: { epochs: 3 }
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when training_file_id is not provided', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the training file ID');
        });
        it('Test when training_file_id is empty string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the training file ID');
        });
        it('Test when training_file_id is not a string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the training file ID');
        });
        it('Test when modelID is not provided', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, fileId, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, fileId, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createFineTuningJob(httpRequestMock, throwErrorMock, fileId, 123)
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

            await createFineTuningJob(httpRequestMock, throwErrorMock, fileId, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createFineTuningJob(httpRequestMock, throwErrorMock, fileId, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});