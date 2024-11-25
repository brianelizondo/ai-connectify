import imageToVideo from '../../../../lib/connectors/AI/Stability/methods/imageToVideo';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - imageToVideo method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const pathImage = '/path/to/image/file.jpg';
    const cfg_scale = 1.5;
    const motion_bucket_id =  124;
    const seed = 0.1;
    
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

            const expectedResponse = { video_generated_id: mockResponse.data.id };

            const response = await imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, seed);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/image-to-video',
                expect.objectContaining({
                    append: mockFormData.append
                }), 
                expect.objectContaining({
                    headers: { 
                        'content-type': 'multipart/form-data'
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
        it('Test when pathImage is not provided', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });

        it('Test when cfg_scale is not provided', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, undefined)
            ).rejects.toThrow('Cannot process the cfg scale');
        });
        it('Test when cfg_scale is empty string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, '')
            ).rejects.toThrow('Cannot process the cfg scale');
        });
        it('Test when cfg_scale is not a string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, '123')
            ).rejects.toThrow('Cannot process the cfg scale');
        });

        it('Test when motion_bucket_id is not provided', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, undefined)
            ).rejects.toThrow('Cannot process the motion bucket ID');
        });
        it('Test when motion_bucket_id is empty string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, '')
            ).rejects.toThrow('Cannot process the motion bucket ID');
        });
        it('Test when motion_bucket_id is not a string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, '123')
            ).rejects.toThrow('Cannot process the motion bucket ID');
        });

        it('Test when seed is not provided', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, undefined)
            ).rejects.toThrow('Cannot process the seed');
        });
        it('Test when seed is empty string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, '')
            ).rejects.toThrow('Cannot process the seed');
        });
        it('Test when seed is not a string', async () => {
            await expect(
                imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, '123')
            ).rejects.toThrow('Cannot process the seed');
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

            await imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, seed);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await imageToVideo(httpRequestMock, throwErrorMock, pathImage, cfg_scale, motion_bucket_id, seed);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});