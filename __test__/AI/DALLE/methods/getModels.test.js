import getModels from '../../../../lib/connectors/AI/DALLE/methods/getModels';

describe("DALLE - getModels method", () => {
    let httpRequestMock;
    let throwErrorMock;
    
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
            const expectedResponse = { data: [{ id: 'model1' }, { id: 'model2' }] };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getModels(
                httpRequestMock,
                throwErrorMock
            );

            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith('/models');
            expect(response).toEqual(expectedResponse.data);
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

            await getModels(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getModels(httpRequestMock, throwErrorMock);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});