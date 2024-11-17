import getMessageBatchResults from '../../../../lib/connectors/AI/Claude/methods/getMessageBatchResults';

describe("Claude - getMessageBatchResults method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messageBatchId = 'message-batch-id-16-characters';
    
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
                id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                type: "message_batch",
                processing_status: "in_progress"
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getMessageBatchResults(
                httpRequestMock,
                throwErrorMock,
                messageBatchId
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                `/messages/batches/${messageBatchId}/results`, 
                {
                    headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                }
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when messageBatchID is not provided', async () => {
            await expect(
                getMessageBatchResults(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the message batch ID');
        });
        it('Test when messageBatchID is empty string', async () => {
            await expect(
                getMessageBatchResults(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the message batch ID');
        });
        it('Test when messageBatchID is not a string', async () => {
            await expect(
                getMessageBatchResults(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the message batch ID');
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

            await getMessageBatchResults(httpRequestMock, throwErrorMock, messageBatchId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getMessageBatchResults(httpRequestMock, throwErrorMock, messageBatchId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});