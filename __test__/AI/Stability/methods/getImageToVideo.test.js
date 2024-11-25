import getImageToVideo from '../../../../lib/connectors/AI/Stability/methods/getImageToVideo';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - getImageToVideo method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const videoId = 'video-test-id';
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
        it('Test make a POST request to the correct endpoint', async () => {
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
            httpRequestMock.getFull.mockResolvedValue(mockResponse);

            const expectedResponse = { video_path: `.${destinationFolder}/${videoId}.mp4` };

            const response = await getImageToVideo(httpRequestMock, throwErrorMock, videoId, destinationFolder);
            expect(httpRequestMock.getFull).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.getFull).toHaveBeenCalledWith(
                `/image-to-video/result/${videoId}`,
                {}, 
                expect.objectContaining({
                    validateStatus: null,
                    responseType: "arraybuffer",
                    headers: { 
                        Accept: "video/*" 
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
        it('Test when videoId is not provided', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the video ID');
        });
        it('Test when videoId is empty string', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the video ID');
        });
        it('Test when videoId is not a string', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the video ID');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, videoId, undefined)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, videoId, '')
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                getImageToVideo(httpRequestMock, throwErrorMock, videoId, 123)
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

            await getImageToVideo(httpRequestMock, throwErrorMock, videoId, destinationFolder);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.getFull.mockRejectedValue(networkError);

            await getImageToVideo(httpRequestMock, throwErrorMock, videoId, destinationFolder);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});