import controlSketch from '../../../../lib/connectors/AI/Stability/methods/controlSketch';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - controlSketch method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = 'a medieval castle on a hill';
    const pathImage = '/path/to/image/file.jpg';
    const destinationFolder = '/test_folder';
    const output_format = 'png';
    const config = { control_strength: 0.7 };
    
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

            const expectedResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };

            const response = await controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, output_format, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/stable-image/control/sketch',
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
                expectedResponse.image_path,
                mockResponseBuffer
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
                controlSketch(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });

        it('Test when pathImage is not provided', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        
        it('Test when destinationFolder is not provided', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, undefined, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, '', output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, 123, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        
        it('Test when output_format is not provided', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, undefined)
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is empty string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, '')
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is not a string', async () => {
            await expect(
                controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, 123)
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

            await controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await controlSketch(httpRequestMock, throwErrorMock, prompt, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});