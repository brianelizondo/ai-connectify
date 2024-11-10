import cancelFineTuningJob from '../../../../lib/connectors/AI/ChatGPT/methods/cancelFineTuningJob';

describe("ChatGPT - cancelFineTuningJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const validJobId = 'ft-job-123-16-characters';
    
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
            const expectedResponse = { status: 'cancelled' };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await cancelFineTuningJob(
                httpRequestMock,
                throwErrorMock,
                validJobId
            );

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                `/fine_tuning/jobs/${validJobId}/cancel`
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_job_id is not provided', async () => {
            await expect(
                cancelFineTuningJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is empty string', async () => {
            await expect(
                cancelFineTuningJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is not a string', async () => {
            await expect(
                cancelFineTuningJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
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

            await cancelFineTuningJob(httpRequestMock, throwErrorMock, validJobId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await cancelFineTuningJob(httpRequestMock, throwErrorMock, validJobId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});