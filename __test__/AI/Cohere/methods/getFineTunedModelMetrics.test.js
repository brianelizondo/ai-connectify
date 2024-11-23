import getFineTunedModelMetrics from '../../../../lib/connectors/AI/Cohere/methods/getFineTunedModelMetrics';

describe("Cohere - getFineTunedModelMetrics method", () => {
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
                step_metrics: [
                    {
                        step_number: 1,
                        created_at: "2024-01-17T20:11:45Z",
                        metrics: {
                            accuracy: 0.4557601809501648,
                            cross_entropy: 4.264331340789795,
                            generation_accuracy: 0.4557601809501648,
                            generation_cross_entropy: 4.264331340789795,
                            step: 0
                        }
                    },
                    {
                        step_number: 9,
                        created_at: "2024-01-17T20:25:19Z",
                        metrics: {
                            accuracy: 0.7393720149993896,
                            cross_entropy: 0.7702581286430359,
                            generation_accuracy: 0.7393720149993896,
                            generation_cross_entropy: 0.7702581286430359,
                            step: 9
                        }
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTunedModelMetrics(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                `/v1/finetuning/finetuned-models/${finetuned_model_id}/training-step-metrics`,
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
                getFineTunedModelMetrics(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is empty string', async () => {
            await expect(
                getFineTunedModelMetrics(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it('Test when finetuned_model_id is not a string', async () => {
            await expect(
                getFineTunedModelMetrics(httpRequestMock, throwErrorMock, 123)
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

            await getFineTunedModelMetrics(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTunedModelMetrics(httpRequestMock, throwErrorMock, finetuned_model_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});