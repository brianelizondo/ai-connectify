import updateFineTuningModel from '../../../../lib/connectors/AI/Mistral/methods/updateFineTuningModel';

describe("Mistral - updateFineTuningModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const fine_tuning_model_id = "fine-tuned-model-test-id";
    const config = {
        name: "updated name",
        description: "updated description"
    }
    
    beforeEach(() => {
        httpRequestMock = {
            patch: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a PATCH request to the correct endpoint', async () => {
            const expectedResponse = {
                id: fine_tuning_model_id,
                object: "model",
                archived: true,
                name: config.name,
                description: config.description,
            };
            httpRequestMock.patch.mockResolvedValue(expectedResponse);

            const response = await updateFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id, config);

            expect(httpRequestMock.patch).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.patch).toHaveBeenCalledWith(
                `/fine_tuning/models/${fine_tuning_model_id}`, 
                expect.objectContaining({
                    ...config
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_model_id is not provided', async () => {
            await expect(
                updateFineTuningModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is empty string', async () => {
            await expect(
                updateFineTuningModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is not a string', async () => {
            await expect(
                updateFineTuningModel(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.patch.mockRejectedValue(apiError);

            await updateFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.patch.mockRejectedValue(networkError);

            await updateFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});