import createModeration from '../../../../lib/connectors/AI/ChatGPT/methods/createModeration';

describe("ChatGPT - createModeration method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const input = 'test text';
    const modelId = 'model-test-id';
    
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
            const expectedResponse = { results: [{ flagged: false }] };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createModeration(httpRequestMock, throwErrorMock, input, modelId);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/moderations',
                expect.objectContaining({
                    input,
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when modelID is not provided', async () => {
            await expect(
                createModeration(httpRequestMock, throwErrorMock, input, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createModeration(httpRequestMock, throwErrorMock, input, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createModeration(httpRequestMock, throwErrorMock, input, 123)
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

            await createModeration(httpRequestMock, throwErrorMock, input, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createModeration(httpRequestMock, throwErrorMock, input, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});