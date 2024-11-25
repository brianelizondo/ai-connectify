import videoStableFast from '../../../../lib/connectors/AI/Stability/methods/videoStableFast';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - videoStableFast method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const pathImage = '/path/to/image/file.jpg';
    const destinationFolder = '/test_folder';
    const config = { remesh: 'none' };
    
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
            jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

            const mockResponseBuffer = Buffer.from('mock image data');
            const mockResponse = {
                status: 200,
                data: mockResponseBuffer
            };

            httpRequestMock.postForm.mockResolvedValue(mockResponse);

            const mockRandomId = 'random123';
            jest.spyOn(HelperFunctions, 'generateRandomID').mockReturnValue(mockRandomId);

            const expectedResponse = { video_path: `.${destinationFolder}/${mockRandomId}.gbl` };

            const response = await videoStableFast(httpRequestMock, throwErrorMock, pathImage, destinationFolder, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/3d/stable-fast-3d',
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
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                expectedResponse.video_path,
                mockResponseBuffer
            );
            expect(response).toEqual(expectedResponse);

            // restore mocks
            createReadStreamSpy.mockRestore();
            jest.restoreAllMocks();
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when pathImage is not provided', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        
        it('Test when destinationFolder is not provided', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, pathImage, undefined)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, pathImage, '')
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                videoStableFast(httpRequestMock, throwErrorMock, pathImage, 123)
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
            httpRequestMock.postForm.mockRejectedValue(apiError);

            await videoStableFast(httpRequestMock, throwErrorMock, pathImage, destinationFolder, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await videoStableFast(httpRequestMock, throwErrorMock, pathImage, destinationFolder, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});