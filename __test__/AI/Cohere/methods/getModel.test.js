import getModel from '../../../../lib/connectors/AI/Cohere/methods/getModel';

describe("Cohere - getModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const modelId = 'model-test-id';
    
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
            const expectedResponse = {
                name: "name",
                endpoints: ["chat"],
                finetuned: true,
                context_length: 1.1,
                tokenizer_url: "tokenizer_url"
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getModel(httpRequestMock, throwErrorMock, modelId);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/v1/models/${modelId}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when model ID is not provided', async () => {
            await expect(
                getModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                getModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
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

            await getModel(httpRequestMock, throwErrorMock, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getModel(httpRequestMock, throwErrorMock, modelId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});