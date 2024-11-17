import getMessageBatchList from '../../../../lib/connectors/AI/Claude/methods/getMessageBatchList';

describe("Claude - getMessageBatchList method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const config = { limit: 20 };
    
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
                "data": [
                    {
                        id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                        type: "message_batch",
                        processing_status: "in_progress",
                        results_url: "https://api.anthropic.com/v1/messages/batches"
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getMessageBatchList(
                httpRequestMock,
                throwErrorMock,
                config
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                '/messages/batches', 
                {
                    params: { ...config },
                    headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                }
            );
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

            await getMessageBatchList(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getMessageBatchList(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});