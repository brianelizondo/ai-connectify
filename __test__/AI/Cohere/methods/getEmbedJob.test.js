import getEmbedJob from '../../../../lib/connectors/AI/Cohere/methods/getEmbedJob';

describe("Cohere - getEmbedJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const embed_job_id = "embed-job-test-id";
    
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
                job_id: embed_job_id,
                status: "processing",
                model: "model",
                name: "name",
                meta: { 
                    api_version: { version: "version" } 
                }
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/v1/embed-jobs/${embed_job_id}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when embed_job_id is not provided', async () => {
            await expect(
                getEmbedJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the embed job ID');
        });
        it('Test when embed_job_id is empty string', async () => {
            await expect(
                getEmbedJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the embed job ID');
        });
        it('Test when embed_job_id is not a string', async () => {
            await expect(
                getEmbedJob(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the embed job ID');
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

            await getEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});