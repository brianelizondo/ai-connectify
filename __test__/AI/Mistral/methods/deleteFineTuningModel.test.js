import deleteFineTuningModel from '../../../../lib/connectors/AI/Mistral/methods/deleteFineTuningModel';

describe("Mistral - deleteFineTuningModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const fine_tuning_model_id = "fine-tuned-model-test-id";
    
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
        it('Test make a POST request to the correct endpoint', async () => {
            const expectedResponse = {
                id: fine_tuning_model_id,
                object: "model",
                deleted: true
            };
            httpRequestMock.delete.mockResolvedValue(expectedResponse);

            const response = await deleteFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);

            expect(httpRequestMock.delete).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.delete).toHaveBeenCalledWith(`/models/${fine_tuning_model_id}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_model_id is not provided', async () => {
            await expect(
                deleteFineTuningModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is empty string', async () => {
            await expect(
                deleteFineTuningModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is not a string', async () => {
            await expect(
                deleteFineTuningModel(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine tunning model ID');
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

            await deleteFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.delete.mockRejectedValue(networkError);

            await deleteFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});