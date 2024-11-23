import getFineTunedModelChronology from '../../../../lib/connectors/AI/Cohere/methods/getFineTunedModelChronology';

describe("Cohere - getFineTunedModelChronology method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const finetuned_model_id = 'fine-tuned-model-test-id';
    const config = { next_page_token: "next_page_token" }
    
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
                events: [
                    {
                        user_id: "7a317d97-4d05-427d-9396-f31b9fb92c55",
                        status: "STATUS_QUEUED",
                        created_at: "2024-01-17T20:11:45Z"
                    },
                    {
                        user_id: "7a317d97-4d05-427d-9396-f31b9fb92c55",
                        status: "STATUS_FINETUNING",
                        created_at: "2024-01-17T20:11:46Z"
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTunedModelChronology(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                `/v1/finetuning/finetuned-models/${finetuned_model_id}/events`,
                expect.objectContaining({
                    params: { ...config }
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when finetuned_model_id is not provided', async () => {
            await expect(
                getFineTunedModelChronology(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is empty string', async () => {
            await expect(
                getFineTunedModelChronology(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is not a string', async () => {
            await expect(
                getFineTunedModelChronology(httpRequestMock, throwErrorMock, 123)
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

            await getFineTunedModelChronology(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTunedModelChronology(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});