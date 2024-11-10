import createChatCompletion from '../../../../lib/connectors/AI/ChatGPT/methods/createChatCompletion';

describe("ChatGPT - createChatCompletion method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messages = [{ role: 'user', content: 'Hello' }];
    const modelId = 'model-test-id';
    const config = { temperature: 0.7 };
    
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
                choices: [{ message: { content: 'Hi!' } }]
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createChatCompletion(httpRequestMock, throwErrorMock, messages, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/chat/completions',
                expect.objectContaining({
                    messages,
                    model: modelId,
                    temperature: 0.7
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
                createChatCompletion(httpRequestMock, throwErrorMock, messages, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, messages, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                createChatCompletion(httpRequestMock, throwErrorMock, messages, 123)
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

            await createChatCompletion(httpRequestMock, throwErrorMock, messages, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createChatCompletion(httpRequestMock, throwErrorMock, messages, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});