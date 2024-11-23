import getFineTunedModel from '../../../../lib/connectors/AI/Cohere/methods/getFineTunedModel';

describe("Cohere - getFineTunedModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const finetuned_model_id = 'fine-tuned-model-test-id';
    
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
                finetuned_model: {
                    id: finetuned_model_id,
                    name: "name",
                    status: "STATUS_READY"
                }
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
            expect(response).toEqual(expectedResponse.finetuned_model);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when finetuned_model_id is not provided', async () => {
            await expect(
                getFineTunedModel(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is empty string', async () => {
            await expect(
                getFineTunedModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is not a string', async () => {
            await expect(
                getFineTunedModel(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
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

            await getFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});