import createMessage from '../../../../lib/connectors/AI/Claude/methods/createMessage';

describe("Claude - createMessage method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messagesArray = [
        {"role": "user", "content": "Hello, world"}
    ];
    const modelId = 'model-test-id';
    const maxTokens = 1024;
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
                "content": [{
                        text: "Hi! My name is Claude.",
                        type: "text"
                    }
                ],
                id: "msg_013Zva2CMHLNnXjNJJKqJ2EF",
                model: "claude-3-5-sonnet-20241022",
                role: "assistant"
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createMessage(
                httpRequestMock,
                throwErrorMock,
                messagesArray, modelId, maxTokens, config
            );

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/messages', 
                { ...config, messages: messagesArray, model: modelId, max_tokens: maxTokens }
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when messagesArray is not provided', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the messages array');
        });
        it('Test when messagesArray is empty array', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the messages array');
        });
        it('Test when messagesArray is not a array', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });

        it('Test when modelID is not provided', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, messagesArray, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, messagesArray, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, messagesArray, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        it('Test when maxTokens is not provided', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, messagesArray, modelId, undefined)
            ).rejects.toThrow('Cannot process the max tokens value');
        });
        it('Test when maxTokens is not a number', async () => {
            await expect(
                createMessage(httpRequestMock, throwErrorMock, messagesArray, modelId, '123')
            ).rejects.toThrow('Cannot process the max tokens value');
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

            await createMessage(httpRequestMock, throwErrorMock, messagesArray, modelId, maxTokens, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createMessage(httpRequestMock, throwErrorMock, messagesArray, modelId, maxTokens, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});