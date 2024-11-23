import embed from '../../../../lib/connectors/AI/Cohere/methods/embed';

describe("Cohere - embed method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const input_type = 'input-image-test';
    const embedding_types = ["float"];
    const modelID = 'model-test-id';
    const config = { truncate: "NONE" };
    
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
                id: "5807ee2e-0cda-445a-9ec8-864c60a06606",
                embeddings: {
                    float: [[-0.007247925, -0.041229248, -0.023223877, -0.08392334, -0.03378296]]
                },
                texts: [],
                images: [{
                    width: 400,
                    height: 400,
                    format: "jpeg",
                    bit_depth: 24
                }],
                meta: {
                    api_version: { version: 2 }
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await embed(httpRequestMock, throwErrorMock, input_type, embedding_types, modelID, config);
            
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v2/embed',
                expect.objectContaining({ 
                    ...config, 
                    input_type, 
                    embedding_types, 
                    model: modelID 
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when input_type is not provided', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the input type');
        });
        it('Test when input_type is empty string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the input type');
        });
        it('Test when input_type is not a string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the input type');
        });

        it('Test when embedding_types is not provided', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, undefined)
            ).rejects.toThrow('Cannot process the embedding types');
        });
        it('Test when embedding_types is empty string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, '')
            ).rejects.toThrow('Cannot process the embedding types');
        });
        it('Test when embedding_types is not a string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, 123)
            ).rejects.toThrow('This is not an array');
        });

        it('Test when modelID is not provided', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, embedding_types, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, embedding_types, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                embed(httpRequestMock, throwErrorMock, input_type, embedding_types, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'Job not found'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await embed(httpRequestMock, throwErrorMock, input_type, embedding_types, modelID, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await embed(httpRequestMock, throwErrorMock, input_type, embedding_types, modelID, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});