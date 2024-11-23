import getEmbedJobs from '../../../../lib/connectors/AI/Cohere/methods/getEmbedJobs';

describe("Cohere - getEmbedJobs method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    
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
                embed_jobs : [
                    {
                        job_id: "job_id_1",
                        status: "processing",
                        model: "model",
                        name: "name",
                        meta: { 
                            api_version: { version: "version" } 
                        }
                    },
                    {
                        job_id: "job_id_2",
                        status: "processing",
                        model: "model",
                        name: "name",
                        meta: { 
                            api_version: { version: "version" } 
                        }
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getEmbedJobs(httpRequestMock, throwErrorMock);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith('/v1/embed-jobs');
            expect(response).toEqual(expectedResponse.embed_jobs);
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

            await getEmbedJobs(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getEmbedJobs(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});