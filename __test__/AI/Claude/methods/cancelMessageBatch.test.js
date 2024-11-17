import cancelMessageBatch from '../../../../lib/connectors/AI/Claude/methods/cancelMessageBatch';

describe("Claude - cancelMessageBatch method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messageBatchId = 'message-batch-id-16-characters';
    
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
            const expectedResponse = { id: messageBatchId, type: "message_batch" };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await cancelMessageBatch(
                httpRequestMock,
                throwErrorMock,
                messageBatchId
            );

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                `/messages/batches/${messageBatchId}/cancel`, 
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
                cancelMessageBatch(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the message batch ID');
        });
        it('Test when messageBatchID is empty string', async () => {
            await expect(
                cancelMessageBatch(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the message batch ID');
        });
        it('Test when messageBatchID is not a string', async () => {
            await expect(
                cancelMessageBatch(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.post.mockRejectedValue(apiError);

            await cancelMessageBatch(httpRequestMock, throwErrorMock, messageBatchId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await cancelMessageBatch(httpRequestMock, throwErrorMock, messageBatchId);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});