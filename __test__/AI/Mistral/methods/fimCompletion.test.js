import fimCompletion from '../../../../lib/connectors/AI/Mistral/methods/fimCompletion';

describe("Mistral - fimCompletion method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = "prompt for testing";
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

            const response = await fimCompletion(httpRequestMock, throwErrorMock, prompt, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/fim/completions',
                expect.objectContaining({
                    ...config, 
                    prompt: prompt, 
                    model: modelId,
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when prompt is not provided', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when model ID is not provided', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, prompt, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, prompt, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                fimCompletion(httpRequestMock, throwErrorMock, prompt, 123)
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

            await fimCompletion(httpRequestMock, throwErrorMock, prompt, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await fimCompletion(httpRequestMock, throwErrorMock, prompt, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});