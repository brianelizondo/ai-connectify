import searchAndRecolor from '../../../../lib/connectors/AI/Stability/methods/searchAndRecolor';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - searchAndRecolor method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = 'a yellow car';
    const select_prompt = 'car';
    const pathImage = '/path/to/image/file.jpg';
    const destinationFolder = '/test_folder';
    const output_format = 'png';
    const config = { grow_mask: 10 };
    
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

            const response = await searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, output_format, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/stable-image/edit/search-and-recolor',
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
                searchAndRecolor(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });

        it('Test when select_prompt is not provided', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, undefined)
            ).rejects.toThrow('Cannot process the select prompt');
        });
        it('Test when select_prompt is empty string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, '')
            ).rejects.toThrow('Cannot process the select prompt');
        });
        it('Test when select_prompt is not a string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, 123)
            ).rejects.toThrow('Cannot process the select prompt');
        });

        it('Test when pathImage is not provided', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, undefined, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, '', output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, 123, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });

        it('Test when output_format is not provided', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, undefined)
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is empty string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, '')
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is not a string', async () => {
            await expect(
                searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, 123)
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

            await searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await searchAndRecolor(httpRequestMock, throwErrorMock, prompt, select_prompt, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});