import tokenize from '../../../../lib/connectors/AI/Cohere/methods/tokenize';

describe("Cohere - tokenize method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const text = "tokenize me! :D";
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
                tokens: [8466, 5169, 2594, 8, 2792, 43],
                token_strings: ["token", "ize", " me", "!", " :", "D"],
                meta: {
                    api_version: { version: 1 }
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await tokenize(httpRequestMock, throwErrorMock, text, modelId);
            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/tokenize', 
                expect.objectContaining({ 
                    text: text, 
                    model: modelId 
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when text is not provided', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the text');
        });
        it('Test when text is empty string', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the text');
        });
        it('Test when text is not a string', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the text');
        });

        it('Test when model ID is not provided', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock, text, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock, text, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                tokenize(httpRequestMock, throwErrorMock, text, 123)
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

            await tokenize(httpRequestMock, throwErrorMock, text, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await tokenize(httpRequestMock, throwErrorMock, text, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});