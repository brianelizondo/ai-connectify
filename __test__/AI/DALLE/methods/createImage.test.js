import createImage from '../../../../lib/connectors/AI/DALLE/methods/createImage';
import FormData from 'form-data';

jest.mock('form-data');

describe("DALLE - createImage method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = 'test prompt';
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
            const expectedResponse = { data: [{ url: 'http://example.com/image.png' }] };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await createImage(httpRequestMock, throwErrorMock, prompt, modelId, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/images/generations',
                expect.objectContaining({
                    ...config,
                    prompt,
                    model: modelId
                })
            );
            expect(response).toEqual(expectedResponse.data);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when prompt is not provided', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when modelID is not provided', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, prompt, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, prompt, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createImage(httpRequestMock, throwErrorMock, prompt, 123)
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

            await createImage(httpRequestMock, throwErrorMock, prompt, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createImage(httpRequestMock, throwErrorMock, prompt, modelId, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});