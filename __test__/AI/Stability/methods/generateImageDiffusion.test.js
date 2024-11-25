import generateImageDiffusion from '../../../../lib/connectors/AI/Stability/methods/generateImageDiffusion';
import HelperFunctions from '../../../../lib/helpers/HelperFunctions';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('form-data');

describe("Stability - generateImageDiffusion method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const prompt = 'a medieval castle on a hill';
    const destinationFolder = '/test_folder';
    const strength = 0.5;
    const modelID = "test-model-id";
    const mode = "mode-test";
    const output_format = 'png';
    const config = { strength: 0.7 };
    
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

            const response = await generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, output_format, config);

            expect(httpRequestMock.postForm).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.postForm).toHaveBeenCalledWith(
                '/stable-image/generate/sd3',
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
                generateImageDiffusion(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the prompt');
        });
        it('Test when prompt is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the prompt');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, undefined, strength, modelID, mode, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, '', strength, modelID, mode, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, 123, strength, modelID, mode, output_format)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        
        it('Test when strength is not provided', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, undefined)
            ).rejects.toThrow('Cannot process the strength value');
        });
        it('Test when strength is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, '')
            ).rejects.toThrow('Cannot process the strength value');
        });
        it('Test when strength is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, '123')
            ).rejects.toThrow('Cannot process the strength value');
        });

        it('Test when modelID is not provided', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        it('Test when mode is not provided', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, undefined)
            ).rejects.toThrow('Cannot process the mode');
        });
        it('Test when mode is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, '')
            ).rejects.toThrow('Cannot process the mode');
        });
        it('Test when mode is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, 123)
            ).rejects.toThrow('Cannot process the mode');
        });

        it('Test when output_format is not provided', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, undefined)
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is empty string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, '')
            ).rejects.toThrow('Cannot process the output format');
        });
        it('Test when output_format is not a string', async () => {
            await expect(
                generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, 123)
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

            await generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.postForm.mockRejectedValue(networkError);

            await generateImageDiffusion(httpRequestMock, throwErrorMock, prompt, destinationFolder, strength, modelID, mode, output_format, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});