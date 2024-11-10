import createImageVariation from '../../../../lib/connectors/AI/DALLE/methods/createImageVariation';
import FormData from 'form-data';

jest.mock('form-data');

describe("DALLE - createImageVariation method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const imagePath = '/path/to/image.png';
    const modelId = 'test-model-id';
    const config = { size: '1024x1024' };
    
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

            const expectedResponse = { data: [{ url: 'http://example.com/variation-image.png' }] };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createImageVariation(httpRequestMock, throwErrorMock, imagePath, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/images/variations',
                expect.objectContaining({
                    append: mockFormData['append']
                }), 
                expect.objectContaining({
                    headers: { 'content-type': 'multipart/form-data' }
                })
            );
            expect(response).toEqual(expectedResponse.data);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when imagePath is not provided', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the image path');
        });
        it('Test when imagePath is empty string', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the image path');
        });
        it('Test when imagePath is not a string', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the image path');
        });
        it('Test when modelID is not provided', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, imagePath, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, imagePath, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createImageVariation(httpRequestMock, throwErrorMock, imagePath, 123)
            ).rejects.toThrow('Cannot process the model ID');
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

            await createImageVariation(httpRequestMock, throwErrorMock, imagePath, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createImageVariation(httpRequestMock, throwErrorMock, imagePath, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});