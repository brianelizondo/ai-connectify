import embeddings from '../../../../lib/connectors/AI/Mistral/methods/embeddings';

describe("Mistral - embeddings method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const input = [
        "Embed this sentence.",
        "As well as this one."
    ];
    const modelId = 'model-test-id';
    const config = { max_tokens: 0.7 };
    
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

            const response = await embeddings(httpRequestMock, throwErrorMock, input, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/embeddings',
                expect.objectContaining({
                    ...config, 
                    input: input, 
                    model: modelId,
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when model ID is not provided', async () => {
            await expect(
                embeddings(httpRequestMock, throwErrorMock, input, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                embeddings(httpRequestMock, throwErrorMock, input, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                embeddings(httpRequestMock, throwErrorMock, input, 123)
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

            await embeddings(httpRequestMock, throwErrorMock, input, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await embeddings(httpRequestMock, throwErrorMock, input, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});