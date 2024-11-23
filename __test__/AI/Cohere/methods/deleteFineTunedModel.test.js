import deleteFineTunedModel from '../../../../lib/connectors/AI/Cohere/methods/deleteFineTunedModel';

describe("Cohere - deleteFineTunedModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const finetuned_model_id = 'fine-tuned-model-test-id';
    
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
            const expectedResponse = {
                finetuned_model_id,
                status: "deleted"
            };
            httpRequestMock.delete.mockResolvedValue(expectedResponse);

            const response = await deleteFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(httpRequestMock.delete).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.delete).toHaveBeenCalledWith(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when finetuned_model_id is not provided', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is empty string', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is not a string', async () => {
            await expect(
                deleteFineTunedModel(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.delete.mockRejectedValue(apiError);

            await deleteFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.delete.mockRejectedValue(networkError);

            await deleteFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});