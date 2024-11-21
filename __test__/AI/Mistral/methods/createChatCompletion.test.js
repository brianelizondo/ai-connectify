import createChatCompletion from '../../../../lib/connectors/AI/Mistral/methods/createChatCompletion';

describe("Mistral - createChatCompletion method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messagesArray = [{ 
        role: "user",
        content: "Who is the best French painter? Answer in one short sentence."
     }];
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

            const response = await createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/chat/completions',
                expect.objectContaining({
                    ...config, 
                    messages: messagesArray, 
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when messagesArray is not provided', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the messages array');
        });
        it('Test when messagesArray is empty array', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the messages array');
        });
        it('Test when messagesArray is not an array', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });
        it('Test when model ID is not provided', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, 123)
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

            await createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createChatCompletion(httpRequestMock, throwErrorMock, messagesArray, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});