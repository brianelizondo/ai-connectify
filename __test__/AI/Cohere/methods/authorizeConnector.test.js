import authorizeConnector from '../../../../lib/connectors/AI/Cohere/methods/authorizeConnector';

describe("Cohere - authorizeConnector method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const connector_id = 'connector-test-id';
    const afterTokenRedirectUrl = "http://www.test-redirect.com";
    
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
                redirect_url: afterTokenRedirectUrl
              };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await authorizeConnector(httpRequestMock, throwErrorMock, connector_id);
            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(`/v1/connectors/${connector_id}/oauth/authorize`);
            expect(response).toEqual(expectedResponse);
        });
        it('Test make a POST request to the correct endpoint with redirect URL', async () => {
            const expectedResponse = {
                redirect_url: afterTokenRedirectUrl
              };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await authorizeConnector(httpRequestMock, throwErrorMock, connector_id, afterTokenRedirectUrl);
            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(`/v1/connectors/${connector_id}/oauth/authorize?after_token_redirect=${afterTokenRedirectUrl}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when connector ID is not provided', async () => {
            await expect(
                authorizeConnector(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is empty string', async () => {
            await expect(
                authorizeConnector(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the connector ID');
        });
        it('Test when connector ID is not a string', async () => {
            await expect(
                authorizeConnector(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the connector ID');
        });

        it('Test when Redirect URL is not a string', async () => {
            await expect(
                authorizeConnector(httpRequestMock, throwErrorMock, connector_id, 123)
            ).rejects.toThrow('Cannot process the after token redirect URL');
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

            await authorizeConnector(httpRequestMock, throwErrorMock, connector_id, afterTokenRedirectUrl);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await authorizeConnector(httpRequestMock, throwErrorMock, connector_id, afterTokenRedirectUrl);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});