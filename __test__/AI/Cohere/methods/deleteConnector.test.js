import deleteConnector from '../../../../lib/connectors/AI/Cohere/methods/deleteConnector';

describe("Cohere - deleteConnector method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const connector_id = 'connector-test-id';
    
    beforeEach(() => {
        httpRequestMock = {
            delete: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a DELETE request to the correct endpoint', async () => {
            const expectedResponse = {
                connector_id,
                status: "deleted"
            };
            httpRequestMock.delete.mockResolvedValue(expectedResponse);

            const response = await deleteConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(httpRequestMock.delete).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.delete).toHaveBeenCalledWith(`/v1/connectors/${connector_id}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when connector ID is not provided', async () => {
            await expect(
                deleteConnector(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is empty string', async () => {
            await expect(
                deleteConnector(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is not a string', async () => {
            await expect(
                deleteConnector(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.delete.mockRejectedValue(apiError);

            await deleteConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.delete.mockRejectedValue(networkError);

            await deleteConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});