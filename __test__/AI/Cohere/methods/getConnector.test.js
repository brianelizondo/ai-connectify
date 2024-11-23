import getConnector from '../../../../lib/connectors/AI/Cohere/methods/getConnector';

describe("Cohere - getConnector method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const connector_id = 'connector-test-id';
    
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
                connector: {
                    id: connector_id,
                    name: "name",
                    auth_status: "valid",
                    active: true
                }
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/v1/connectors/${connector_id}`);
            expect(response).toEqual(expectedResponse.connector);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when connector ID is not provided', async () => {
            await expect(
                getConnector(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is empty string', async () => {
            await expect(
                getConnector(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is not a string', async () => {
            await expect(
                getConnector(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the connector ID');
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

            await getConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});