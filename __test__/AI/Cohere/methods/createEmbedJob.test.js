import createEmbedJob from '../../../../lib/connectors/AI/Cohere/methods/createEmbedJob';

describe("Cohere - createEmbedJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const dataset_id = 'dataset-id-test';
    const modelID = 'model-test-id';
    const input_type = 'dataset-type-test';
    const config = { keep_original_file: true };
    
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
            const expectedResponse = { job_id: "id-test-response" };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, input_type, config);
            
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/embed-jobs', 
                {   ...config, 
                    model: modelID, 
                    dataset_id: dataset_id, 
                    input_type: input_type 
                }
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when dataset_id is not provided', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is empty string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is not a string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the dataset ID');
        });

        it('Test when modelID is not provided', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        it('Test when input_type is not provided', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, undefined)
            ).rejects.toThrow('Cannot process the input type');
        });
        it('Test when input_type is empty string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, '')
            ).rejects.toThrow('Cannot process the input type');
        });
        it('Test when input_type is not a string', async () => {
            await expect(
                createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, 123)
            ).rejects.toThrow('Cannot process the input type');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'Job not found'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, input_type, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createEmbedJob(httpRequestMock, throwErrorMock, dataset_id, modelID, input_type, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});