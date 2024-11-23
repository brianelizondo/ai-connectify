import updateFineTunedModel from '../../../../lib/connectors/AI/Cohere/methods/updateFineTunedModel';

describe("Cohere - updateFineTunedModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const finetuned_model_id = 'fine-tuned-model-test-id';
    const name = 'fine-tuned-model-name-test';
    const settings = {
        base_model: { 
            base_type: "BASE_TYPE_CHAT" 
        },
        dataset_id: "STATUS_READY"
    };
    const config = { status: true };
    
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
                finetuned_model: {
                    name: name,
                    settings: {
                        base_model: settings.base_model,
                        dataset_id: settings.dataset_id,
                        multi_label: true
                    },
                    id: finetuned_model_id,
                    creator_id: "creator_id_response",
                }
            };
            httpRequestMock.patch.mockResolvedValue(expectedResponse);

            const response = await updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, name, settings, config);

            expect(httpRequestMock.patch).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.patch).toHaveBeenCalledWith(
                `/v1/finetuning/finetuned-models/${finetuned_model_id}`,
                expect.objectContaining({ 
                    ...config,
                    name: name, 
                    settings: settings
                })
            );
            expect(response).toEqual(expectedResponse.finetuned_model);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when finetuned_model_id is not provided', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is empty string', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is not a string', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when name is not provided', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, undefined)
            ).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it('Test when name is empty string', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, '')
            ).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it('Test when name is not a string', async () => {
            await expect(
                updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, 123)
            ).rejects.toThrow('Cannot process the fine-tuned model name');
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

            await updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, name, settings, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.patch.mockRejectedValue(networkError);

            await updateFineTunedModel(httpRequestMock, throwErrorMock, finetuned_model_id, name, settings, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});