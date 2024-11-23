import cancelEmbedJob from '../../../../lib/connectors/AI/Cohere/methods/cancelEmbedJob';

describe("Cohere - cancelEmbedJob method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const embed_job_id = "embed-job-test-id";
    
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
                embed_job_id: embed_job_id,
                status: "canceled"
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await cancelEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(`/v1/embed-jobs/${embed_job_id}/cancel`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when embed_job_id is not provided', async () => {
            await expect(
                cancelEmbedJob(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the embed job ID');
        });
        it('Test when embed_job_id is empty string', async () => {
            await expect(
                cancelEmbedJob(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the embed job ID');
        });
        it('Test when embed_job_id is not a string', async () => {
            await expect(
                cancelEmbedJob(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.post.mockRejectedValue(apiError);

            await cancelEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await cancelEmbedJob(httpRequestMock, throwErrorMock, embed_job_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});