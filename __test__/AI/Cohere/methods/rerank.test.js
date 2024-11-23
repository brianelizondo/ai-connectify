import rerank from '../../../../lib/connectors/AI/Cohere/methods/rerank';

describe("Cohere - rerank method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const query = "What is the capital of the United States?";
    const documents = [
        "Carson City is the capital city of the American state of Nevada.",
        "Washington, D.C. (also known as simply Washington or D.C."
    ]
    const modelId = 'model-test-id';
    const config = { top_n: 3 };
    
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
                results: [
                    {
                        index: 1,
                        relevance_score: 0.999071
                    },
                    {
                        index: 0,
                        relevance_score: 0.7867867
                    }
                ],
                id: "test-id-response",
                meta: {
                    api_version: { version: 2 }
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await rerank(httpRequestMock, throwErrorMock, query, documents, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v2/rerank',
                expect.objectContaining({ 
                    ...config, 
                    query, 
                    documents, 
                    model: modelId 
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when query is not provided', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the query');
        });
        it('Test when query is empty string', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the query');
        });
        it('Test when query is not a string', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the query');
        });
        it('Test when documents is not provided', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, undefined)
            ).rejects.toThrow('Cannot process the documents array');
        });
        it('Test when documents is empty array', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, [])
            ).rejects.toThrow('Cannot process the documents array');
        });
        it('Test when documents is not an array', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, 123)
            ).rejects.toThrow('This is not an array');
        });
        it('Test when model ID is not provided', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, documents, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is empty string', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, documents, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when model ID is not a string', async () => {
            await expect(
                rerank(httpRequestMock, throwErrorMock, query, documents, 123)
            ).rejects.toThrow('Cannot process the model ID');
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

            await rerank(httpRequestMock, throwErrorMock, query, documents, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await rerank(httpRequestMock, throwErrorMock, query, documents, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});