import startFineTuningJob from '../../../../lib/connectors/AI/Mistral/methods/startFineTuningJob';

describe("Mistral - startFineTuningJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const fine_tuning_job_id = "fine-tuned-job-test-id";
    
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
                id: fine_tuning_job_id,
                object: "model",
                auto_start: true,
                status: "QUEUED"
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await startFineTuningJob(httpRequestMock, throwErrorMock, fine_tuning_job_id);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(`/fine_tuning/jobs/${fine_tuning_job_id}/start`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_job_id is not provided', async () => {
            await expect(
                startFineTuningJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine tunning job ID');
        });
        it('Test when fine_tuning_job_id is empty string', async () => {
            await expect(
                startFineTuningJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine tunning job ID');
        });
        it('Test when fine_tuning_job_id is not a string', async () => {
            await expect(
                startFineTuningJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine tunning job ID');
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

            await startFineTuningJob(httpRequestMock, throwErrorMock, fine_tuning_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await startFineTuningJob(httpRequestMock, throwErrorMock, fine_tuning_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});