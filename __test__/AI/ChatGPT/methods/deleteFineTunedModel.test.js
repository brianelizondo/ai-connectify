import deleteFineTunedModel from '../../../../lib/connectors/AI/ChatGPT/methods/deleteFineTunedModel';

describe("ChatGPT - deleteFineTunedModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const modelId = 'test-model-id';
    
    beforeEach(() => {
        httpRequestMock = {
            delete: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a DELETE request to the correct endpoint', async () => {
            const expectedResponse = { deleted: true };
            httpRequestMock.delete.mockResolvedValue(expectedResponse);

            const response = await deleteFineTunedModel(
                httpRequestMock,
                throwErrorMock,
                modelId
            );

            expect(httpRequestMock.delete).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.delete).toHaveBeenCalledWith(`/models/${modelId}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when modelID is not provided', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.delete.mockRejectedValue(apiError);

            await deleteFineTunedModel(httpRequestMock, throwErrorMock, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.delete.mockRejectedValue(networkError);

            await deleteFineTunedModel(httpRequestMock, throwErrorMock, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});