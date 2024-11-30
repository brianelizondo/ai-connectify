import getUpscaleCreative from '../../../../lib/connectors/AI/Stability/methods/getUpscaleCreative';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - getUpscaleCreative method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const upscaleId = 'video-test-id';
    const destinationFolder = '/test_folder';
    
    beforeEach(() => {
        httpRequestMock = {
            getFull: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a GET request to the correct endpoint with response status 200', async () => {
            jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

            const mockResponseBuffer = Buffer.from('mock image data');
            const mockResponse = {
                status: 200,
                data: mockResponseBuffer,
                headers: {
                    'content-type': 'image/jpeg'
                }
            };
            httpRequestMock.getFull.mockResolvedValue(mockResponse);
            
            const expectedResponse = { image_path: `.${destinationFolder}/${upscaleId}.jpeg` };

            const response = await getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, destinationFolder);
            expect(httpRequestMock.getFull).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.getFull).toHaveBeenCalledWith(
                `/stable-image/upscale/creative/${upscaleId}`,
                {}, 
                expect.objectContaining({
                    validateStatus: null,
                    responseType: "arraybuffer",
                    headers: { 
                        Accept: "image/*" 
                    }
                })
            );
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                expectedResponse.image_path,
                mockResponseBuffer
            );
            expect(response).toEqual(expectedResponse);

            // restore mocks
            jest.restoreAllMocks();
        });
        it('Test make a GET request to the correct endpoint and handle pending status', async () => {
            const mockResponse = {
                status: 202
            };
            httpRequestMock.getFull.mockResolvedValue(mockResponse);
            
            const response = await getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, destinationFolder);
            expect(httpRequestMock.getFull).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.getFull).toHaveBeenCalledWith(
                `/stable-image/upscale/creative/${upscaleId}`,
                {}, 
                expect.objectContaining({
                    validateStatus: null,
                    responseType: "arraybuffer",
                    headers: { 
                        Accept: "image/*" 
                    }
                })
            );
            expect(response).toEqual({ status: "Generation is still running, try again in 10 seconds" });

            // restore mocks
            jest.restoreAllMocks();
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when upscaleId is not provided', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the upscale ID');
        });
        it('Test when upscaleId is empty string', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the upscale ID');
        });
        it('Test when upscaleId is not a string', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the upscale ID');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, undefined)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, '')
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, 123)
            ).rejects.toThrow('Cannot process the destination folder');
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
            httpRequestMock.getFull.mockRejectedValue(apiError);

            await getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, destinationFolder);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.getFull.mockRejectedValue(networkError);

            await getUpscaleCreative(httpRequestMock, throwErrorMock, upscaleId, destinationFolder);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});