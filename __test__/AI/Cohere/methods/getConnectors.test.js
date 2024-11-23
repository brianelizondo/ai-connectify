import getConnectors from '../../../../lib/connectors/AI/Cohere/methods/getConnectors';

describe("Cohere - getConnectors method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const config = { limit: 50 };
    
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
                connectors: [
                {
                    id: "id",
                    name: "name",
                    auth_status: "valid",
                    active: true
                },
                {
                    id: "id2",
                    name: "name2",
                    auth_status: "valid",
                    active: true
                }
                ]
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getConnectors(httpRequestMock, throwErrorMock, config);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(
                '/v1/connectors', 
                expect.objectContaining({
                    params: { ...config }
                })
            );
            expect(response).toEqual(expectedResponse.connectors);
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

            await getConnectors(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getConnectors(httpRequestMock, throwErrorMock, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});