import getDatasetUsage from '../../../../lib/connectors/AI/Cohere/methods/getDatasetUsage';

describe("Cohere - getDatasetUsage method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    
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
                organization_usage: 1000000
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getDatasetUsage(httpRequestMock, throwErrorMock);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith('/v1/datasets/usage');
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

            await getDatasetUsage(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getDatasetUsage(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});