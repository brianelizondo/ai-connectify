import outpaint from '../../../../lib/connectors/AI/Stability/methods/outpaint';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - outpaint method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const pathImage = '/path/to/image/file.jpg';
    const destinationFolder = '/test_folder';
    const output_format = 'png';
    const config = { fidelity: 0.7 };
    
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

            const response = await outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, output_format, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/stable-image/edit/outpaint',
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
        it('Test when pathImage is not provided', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is empty string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the image path folder');
        });
        it('Test when pathImage is not a string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the image path folder');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, undefined, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, '', output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, 123, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });

        it('Test when output_format is not provided', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, undefined)
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is empty string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, '')
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is not a string', async () => {
            await expect(
                outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, 123)
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

            await outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await outpaint(httpRequestMock, throwErrorMock, pathImage, destinationFolder, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});