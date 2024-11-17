import createMessageBatch from '../../../../lib/connectors/AI/Claude/methods/createMessageBatch';

describe("Claude - createMessageBatch method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const requests = [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ];
    
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
                id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                type: "message_batch",
                processing_status: "in_progress"
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createMessageBatch(
                httpRequestMock,
                throwErrorMock,
                requests
            );

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/messages/batches', 
                { requests }, 
                {
                    headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                }
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when requests is not provided', async () => {
            await expect(
                createMessageBatch(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the requests array');
        });
        it('Test when requests is empty array', async () => {
            await expect(
                createMessageBatch(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the requests array');
        });
        it('Test when requests is not a array', async () => {
            await expect(
                createMessageBatch(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
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

            await createMessageBatch(httpRequestMock, throwErrorMock, requests);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createMessageBatch(httpRequestMock, throwErrorMock, requests);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});