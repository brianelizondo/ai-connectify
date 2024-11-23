import getDataset from '../../../../lib/connectors/AI/Cohere/methods/getDataset';

describe("Cohere - getDataset method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const dataset_id = 'dataset-test-id';
    
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
                dataset: {
                    id: dataset_id,
                    name: "name",
                    schema: "schema",
                    dataset_type: "dataset_type"
                }
            };
            httpRequestMock.get.mockResolvedValue(expectedResponse);

            const response = await getDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(httpRequestMock.get).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.get).toHaveBeenCalledWith(`/v1/datasets/${dataset_id}`);
            expect(response).toEqual(expectedResponse.dataset);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when dataset_id is not provided', async () => {
            await expect(
                getDataset(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is empty string', async () => {
            await expect(
                getDataset(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is not a string', async () => {
            await expect(
                getDataset(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the dataset ID');
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

            await getDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.get.mockRejectedValue(networkError);

            await getDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});