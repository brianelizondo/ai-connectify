import archiveFineTuningModel from '../../../../lib/connectors/AI/Mistral/methods/archiveFineTuningModel';

describe("Mistral - archiveFineTuningModel method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const fine_tuning_model_id = "fine-tuned-model-test-id";
    
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
                id: fine_tuning_model_id,
                object: "model",
                archived: false
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await archiveFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(`/fine_tuning/models/${fine_tuning_model_id}/archive`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_model_id is not provided', async () => {
            await expect(
                archiveFineTuningModel(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is empty string', async () => {
            await expect(
                archiveFineTuningModel(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine tunning model ID');
        });
        it('Test when fine_tuning_model_id is not a string', async () => {
            await expect(
                archiveFineTuningModel(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.post.mockRejectedValue(apiError);

            await archiveFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await archiveFineTuningModel(httpRequestMock, throwErrorMock, fine_tuning_model_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});