import createFineTunedModel from '../../../../lib/connectors/AI/Cohere/methods/createFineTunedModel';

describe("Cohere - createFineTunedModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
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
                finetuned_model: {
                    name: name,
                    settings: {
                        base_model: settings.base_model,
                        dataset_id: settings.dataset_id,
                        multi_label: true
                    },
                    id: "id-test-response",
                    creator_id: "creator_id_response",
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createFineTunedModel(httpRequestMock, throwErrorMock, name, settings, config);
            
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/finetuning/finetuned-models', 
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
        it('Test when name is not provided', async () => {
            await expect(
                createFineTunedModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it('Test when name is empty string', async () => {
            await expect(
                createFineTunedModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it('Test when name is not a string', async () => {
            await expect(
                createFineTunedModel(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine-tuned model name');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'Job not found'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await createFineTunedModel(httpRequestMock, throwErrorMock, name, settings, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createFineTunedModel(httpRequestMock, throwErrorMock, name, settings, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});