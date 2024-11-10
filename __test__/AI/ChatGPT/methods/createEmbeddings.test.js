import createEmbeddings from '../../../../lib/connectors/AI/ChatGPT/methods/createEmbeddings';

describe("ChatGPT - createEmbeddings method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const input = 'test text';
    const modelId = 'model-test-id';
    const config = {};
    
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
            const expectedResponse = { data: [{ embedding: [0.1, 0.2, 0.3] }] };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createEmbeddings(httpRequestMock, throwErrorMock, input, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/embeddings',
                expect.objectContaining({
                    input,
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse.data);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when modelID is not provided', async () => {
            await expect(
                createEmbeddings(httpRequestMock, throwErrorMock, input, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createEmbeddings(httpRequestMock, throwErrorMock, input, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createEmbeddings(httpRequestMock, throwErrorMock, input, 123)
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

            await createEmbeddings(httpRequestMock, throwErrorMock, input, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createEmbeddings(httpRequestMock, throwErrorMock, input, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});