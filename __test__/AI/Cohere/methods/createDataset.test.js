import createDataset from '../../../../lib/connectors/AI/Cohere/methods/createDataset';
import FormData from 'form-data';

jest.mock('form-data');

describe("Cohere - createDataset method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const name = 'dataset-name-test';
    const filePath = './path/to/file.json';
    const type = 'dataset-type-test';
    const config = { keep_original_file: true };
    
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
            const mockFormData = {
                append: jest.fn(),
                getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
            };
            FormData.mockImplementation(() => mockFormData);
            const expectedResponse = { id: "id-test-response" };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createDataset(httpRequestMock, throwErrorMock, name, filePath, type, config);
            
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/v1/datasets',
                expect.objectContaining({
                    append: mockFormData['append']
                }), 
                expect.objectContaining({
                    headers: { 'content-type': 'multipart/form-data' }
                })
            );
            expect(response).toEqual({ dataset_id: expectedResponse.id });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when name is not provided', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the name');
        });
        it('Test when name is empty string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the name');
        });
        it('Test when name is not a string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the name');
        });

        it('Test when filePath is not provided', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, undefined)
            ).rejects.toThrow('Cannot process the file path');
        });
        it('Test when filePath is empty string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, '')
            ).rejects.toThrow('Cannot process the file path');
        });
        it('Test when filePath is not a string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, 123)
            ).rejects.toThrow('Cannot process the file path');
        });

        it('Test when type is not provided', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, type, undefined)
            ).rejects.toThrow('Cannot process the type');
        });
        it('Test when type is empty string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, type, '')
            ).rejects.toThrow('Cannot process the type');
        });
        it('Test when type is not a string', async () => {
            await expect(
                createDataset(httpRequestMock, throwErrorMock, name, type, 123)
            ).rejects.toThrow('Cannot process the type');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'Job not found'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await createDataset(httpRequestMock, throwErrorMock, name, filePath, type, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createDataset(httpRequestMock, throwErrorMock, name, filePath, type, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});