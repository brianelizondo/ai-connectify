import getModel from '../../../../lib/connectors/AI/ChatGPT/methods/getModel';

describe("ChatGPT - getModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const validModelId = 'model-id-123-16-characters';
    
    beforeEach(() => {
        httpRequestMock = {
            get: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a GET request to the correct endpoint', async () => {
            const expectedResponse = { id: validModelId, owner: 'openai' };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getModel(
                httpRequestMock,
                throwErrorMock,
                validModelId
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/models/${validModelId}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when modelID is not provided', async () => {
            await expect(
                getModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                getModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                getModel(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.get.mockRejectedValue(apiError);

            await getModel(httpRequestMock, throwErrorMock, validModelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getModel(httpRequestMock, throwErrorMock, validModelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});