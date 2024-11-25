import upscaleCreative from '../../../../lib/connectors/AI/Stability/methods/upscaleCreative';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - upscaleCreative method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = 'cute fluffy white kitten floating in space, pastel colors';
    const pathImage = '/path/to/image/file.jpg';
    const output_format = 'png';
    const config = { creativity: 0.35 };
    
    beforeEach(() => {
        httpRequestMock = {
            postForm: jest.fn()
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
            
            const mockFileStream = {
                on: jest.fn(),
                pipe: jest.fn(),
                destroy: jest.fn()
            };
            const createReadStreamSpy = jest.spyOn(fs, 'createReadStream').mockReturnValue(mockFileStream);

            const mockResponse = { data: { id: "id-test-from-response" } };

            httpRequestMock.postForm.mockResolvedValue(mockResponse);

            const expectedResponse = { image_id: mockResponse.data.id };

            const response = await upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, output_format, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/stable-image/upscale/creative',
                expect.objectContaining({
                    append: mockFormData.append
                }), 
                expect.objectContaining({
                    validateStatus: null,
                    responseType: "arraybuffer",
                    headers: { 
                        'content-type': 'multipart/form-data',
                        'Accept': "image/*" 
                    }
                })
            );
            expect(response).toEqual(expectedResponse);

            // restore mocks
            createReadStreamSpy.mockRestore();
            jest.restoreAllMocks();
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when prompt is not provided', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });

        it('Test when pathImage is not provided', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });

        it('Test when output_format is not provided', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, undefined)
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is empty string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, '')
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is not a string', async () => {
            await expect(
                upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, 123)
            ).rejects.toThrow('Cannot process the output format');
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
            httpRequestMock.postForm.mockRejectedValue(apiError);

            await upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await upscaleCreative(httpRequestMock, throwErrorMock, prompt, pathImage, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});