import getFineTuningJobEvents from '../../../../lib/connectors/AI/ChatGPT/methods/getFineTuningJobEvents';

describe("ChatGPT - getFineTuningJobEvents method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const validJobId = 'ft-job-123-16-characters';
    const config = { limit: 10 };
    
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
            const expectedResponse = { data: [{ type: 'metrics' }] };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTuningJobEvents(
                httpRequestMock,
                throwErrorMock,
                validJobId, 
                config
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${validJobId}/events`, { params: config});
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when fine_tuning_job_id is not provided', async () => {
            await expect(
                getFineTuningJobEvents(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is empty string', async () => {
            await expect(
                getFineTuningJobEvents(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it('Test when fine_tuning_job_id is not a string', async () => {
            await expect(
                getFineTuningJobEvents(httpRequestMock, throwErrorMock, 123)
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

            await getFineTuningJobEvents(httpRequestMock, throwErrorMock, validJobId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTuningJobEvents(httpRequestMock, throwErrorMock, validJobId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});