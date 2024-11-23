import createConnector from '../../../../lib/connectors/AI/Cohere/methods/createConnector';

describe("Cohere - createConnector method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const name = "Example connector";
    const url = "https://connector-example.com/search";
    const config = { description: "connector description for testing" };
    
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
                "connector": {
                    id: "id",
                    name: name,
                    created_at: "2024-01-15T09:30:00Z",
                    updated_at: "2024-01-15T09:30:00Z",
                    organization_id: "organization_id",
                    description: config.description,
                    url: url,
                }
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createConnector(httpRequestMock, throwErrorMock, name, url, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/connectors',
                expect.objectContaining({ 
                    ...config, 
                    name: name, 
                    url: url 
                })
            );
            expect(response).toEqual(expectedResponse.connector);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when name is not provided', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the name');
        });
        it('Test when name is empty string', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the name');
        });
        it('Test when name is not a string', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the name');
        });
        it('Test when url is not provided', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, name, undefined)
            ).rejects.toThrow('Cannot process the url');
        });
        it('Test when url is empty string', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, name, '')
            ).rejects.toThrow('Cannot process the url');
        });
        it('Test when url is not a string', async () => {
            await expect(
                createConnector(httpRequestMock, throwErrorMock, name, 123)
            ).rejects.toThrow('Cannot process the url');
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

            await createConnector(httpRequestMock, throwErrorMock, name, url, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createConnector(httpRequestMock, throwErrorMock, name, url, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});