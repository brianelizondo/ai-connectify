import getFineTunedModels from '../../../../lib/connectors/AI/Cohere/methods/getFineTunedModels';

describe("Cohere - getFineTunedModels method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const config = { next_page_token: "next_page_token" }
    
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
                finetuned_models: [
                    {
                        id: "id1",
                        name: "name",
                        status: "STATUS_READY"
                    },
                    {
                        id: "id2",
                        name: "name",
                        status: "STATUS_READY"
                    }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getFineTunedModels(httpRequestMock, throwErrorMock, config);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                '/v1/finetuning/finetuned-models',
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

            await getFineTunedModels(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getFineTunedModels(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});