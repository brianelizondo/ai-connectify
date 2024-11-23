import deleteDataset from '../../../../lib/connectors/AI/Cohere/methods/deleteDataset';

describe("Cohere - deleteDataset method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const dataset_id = 'dataset-test-id';
    
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
                dataset_id,
                status: "deleted"
            };
            httpRequestMock.delete.mockResolvedValue(expectedResponse);

            const response = await deleteDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(httpRequestMock.delete).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.delete).toHaveBeenCalledWith(`/v1/datasets/${dataset_id}`);
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when dataset_id is not provided', async () => {
            await expect(
                deleteDataset(httpRequestMock, throwErrorMock)
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is empty string', async () => {
            await expect(
                deleteDataset(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the dataset ID');
        });
        it('Test when dataset_id is not a string', async () => {
            await expect(
                deleteDataset(httpRequestMock, throwErrorMock, 123)
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
            httpRequestMock.delete.mockRejectedValue(apiError);

            await deleteDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.delete.mockRejectedValue(networkError);

            await deleteDataset(httpRequestMock, throwErrorMock, dataset_id);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});