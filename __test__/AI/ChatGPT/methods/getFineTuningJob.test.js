import getFineTuningJob from '../../../../lib/connectors/AI/ChatGPT/methods/getFineTuningJob';

describe("ChatGPT - getFineTuningJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const validJobId = 'ft-job-123-16-characters';
    
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
            const expectedResponse = { id: validJobId, status: 'succeeded' };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTuningJob(
                httpRequestMock,
                throwErrorMock,
                validJobId
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${validJobId}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_job_id is not provided', async () => {
            await expect(
                getFineTuningJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is empty string', async () => {
            await expect(
                getFineTuningJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is not a string', async () => {
            await expect(
                getFineTuningJob(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.get.mockRejectedValue(apiError);

            await getFineTuningJob(httpRequestMock, throwErrorMock, validJobId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTuningJob(httpRequestMock, throwErrorMock, validJobId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});