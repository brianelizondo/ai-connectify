import createTranslation from '../../../../lib/connectors/AI/ChatGPT/methods/createTranslation';
import FormData from 'form-data';

jest.mock('form-data');

describe("ChatGPT - createTranslation method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const filePath = '/test/audio.mp3';
    const modelId = 'model-test-id';
    const config = {};
    
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

            const expectedResponse = { text: 'Transcribed text' };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createTranslation(httpRequestMock, throwErrorMock, filePath, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/audio/translations',
                expect.objectContaining({
                    append: mockFormData['append']
                }), 
                expect.objectContaining({
                    headers: { 'content-type': 'multipart/form-data' }
                })
            );
            expect(response).toEqual(expectedResponse.text);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when filePath is not provided', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the file path');
        });
        it('Test when filePath is empty string', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the file path');
        });
        it('Test when filePath is not a string', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the file path');
        });
        it('Test when modelID is not provided', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, filePath, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, filePath, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createTranslation(httpRequestMock, throwErrorMock, filePath, 123)
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

            await createTranslation(httpRequestMock, throwErrorMock, filePath, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createTranslation(httpRequestMock, throwErrorMock, filePath, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});