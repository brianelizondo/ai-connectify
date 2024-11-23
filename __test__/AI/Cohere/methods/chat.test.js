import chat from '../../../../lib/connectors/AI/Cohere/methods/chat';

describe("Cohere - chat method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messagesArray = [{ 
        role: "user",
        content: "Hello world!"
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
                finish_reason: "COMPLETE",
                message: {
                    role: "assistant",
                    content: [{
                        "type": "text",
                        "text": "LLMs stand for Large Language Models, which are a type of neural network model specialized in processing and generating human language."
                    }]
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await chat(httpRequestMock, throwErrorMock, messagesArray, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v2/chat',
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
                chat(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the messages');
        });
        it('Test when messagesArray is empty array', async () => {
            await expect(
                chat(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the messages');
        });
        it('Test when messagesArray is not an array', async () => {
            await expect(
                chat(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });
        it('Test when model ID is not provided', async () => {
            await expect(
                chat(httpRequestMock, throwErrorMock, messagesArray, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                chat(httpRequestMock, throwErrorMock, messagesArray, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                chat(httpRequestMock, throwErrorMock, messagesArray, 123)
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

            await chat(httpRequestMock, throwErrorMock, messagesArray, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await chat(httpRequestMock, throwErrorMock, messagesArray, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});