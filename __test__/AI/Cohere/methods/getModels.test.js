import getModels from '../../../../lib/connectors/AI/Cohere/methods/getModels';

describe("Cohere - getModels method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const config = { page_token: "page_token" };
    
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
                models: [
                    {
                        name: "name1",
                        endpoints: ["chat"],
                        finetuned: true,
                        context_length: 1.1,
                        tokenizer_url: "tokenizer_url"
                    },
                    {
                        name: "name2",
                        endpoints: ["chat"],
                        finetuned: true,
                        context_length: 1.1,
                        tokenizer_url: "tokenizer_url"
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getModels(httpRequestMock, throwErrorMock, config);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                '/v1/models', 
                expect.objectContaining({
                    params: { ...config }
                })
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

            await getModels(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getModels(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});