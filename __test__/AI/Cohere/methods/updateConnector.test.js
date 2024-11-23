import updateConnector from '../../../../lib/connectors/AI/Cohere/methods/updateConnector';

describe("Cohere - updateConnector method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const connector_id = 'connector-test-id';
    const config = { 
        name: "name for update",
        url: "https://example.com/search"
    };
    
    beforeEach(() => {
        httpRequestMock = {
            patch: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a PATCH request to the correct endpoint', async () => {
            const expectedResponse = {
                "connector": {
                    id: connector_id,
                    name: config.name,
                    created_at: "2024-01-15T09:30:00Z",
                    updated_at: "2024-01-15T09:30:00Z",
                    organization_id: "organization_id",
                    url: config.url,
                }
            };
            httpRequestMock.patch.mockResolvedValue(expectedResponse);

            const response = await updateConnector(httpRequestMock, throwErrorMock, connector_id, config);

            expect(httpRequestMock.patch).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.patch).toHaveBeenCalledWith(
                `/v1/connectors/${connector_id}`,
                expect.objectContaining({ ...config })
            );
            expect(response).toEqual(expectedResponse.connector);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when connector ID is not provided', async () => {
            await expect(
                updateConnector(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is empty string', async () => {
            await expect(
                updateConnector(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is not a string', async () => {
            await expect(
                updateConnector(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.patch.mockRejectedValue(apiError);

            await updateConnector(httpRequestMock, throwErrorMock, connector_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.patch.mockRejectedValue(networkError);

            await updateConnector(httpRequestMock, throwErrorMock, connector_id, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});