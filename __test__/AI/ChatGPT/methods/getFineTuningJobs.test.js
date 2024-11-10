import getFineTuningJobs from '../../../../lib/connectors/AI/ChatGPT/methods/getFineTuningJobs';

describe("ChatGPT - getFineTuningJobs method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
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
            const expectedResponse = { data: [{ id: 'job1' }, { id: 'job2' }] };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTuningJobs(
                httpRequestMock,
                throwErrorMock,
                config
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith('/fine_tuning/jobs', { params: config});
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
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

            await getFineTuningJobs(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTuningJobs(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});