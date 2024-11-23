import detokenize from '../../../../lib/connectors/AI/Cohere/methods/detokenize';

describe("Cohere - detokenize method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const tokens = [8466, 5169, 2594, 8, 2792, 43];
    const modelId = "model-test-id";
    
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
                text: "tokenize me! :D",
                meta: {
                    api_version: { version: 1 }
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await detokenize(httpRequestMock, throwErrorMock, tokens, modelId);
            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/detokenize', 
                expect.objectContaining({ 
                    tokens: tokens, 
                    model: modelId 
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when tokens is not provided', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the tokens array');
        });
        it('Test when tokens is empty string', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the tokens array');
        });
        it('Test when tokens is not a string', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });

        it('Test when model ID is not provided', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock, tokens, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock, tokens, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                detokenize(httpRequestMock, throwErrorMock, tokens, 123)
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

            await detokenize(httpRequestMock, throwErrorMock, tokens, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await detokenize(httpRequestMock, throwErrorMock, tokens, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});