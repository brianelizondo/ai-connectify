import fs from 'fs';
import FormData from 'form-data';
import HttpClient from '../../../lib/connectors/HttpClient/HttpClient';
import StabilityClient from '../../../lib/connectors/AI/Stability/StabilityClient';
import HelperFunctions from '../../../lib/helpers/HelperFunctions';
import AIConnectifyError from '../../../lib/AIConnectifyError';

jest.mock('../../../lib/connectors/HttpClient/HttpClient');
jest.mock('form-data');

describe("StabilityClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.stability.ai/v2beta";
    const mockBaseHeaders = {
        common: { 
            'Content-Type': 'multipart/form-data'
        },
        Authorization: `Bearer ${mockApiKey}`,
        'Content-Type': 'multipart/form-data'
    }
    let stabilityClient;
    let mockHttpClient;

    // mock data values
    let createReadStreamSpy;
    const mockRandomId = 'random123';
    const mockFormData = {
        append: jest.fn(),
        getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
    };
    const mockResponseBuffer = Buffer.from('mock image data');
  
    beforeEach(() => {
        mockHttpClient = {
            headers: {
                ...mockBaseHeaders
            },
            client: {
                defaults: {}
            },
            getFull: jest.fn(),
            postForm: jest.fn(),
            throwError: jest.fn()
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        stabilityClient = new StabilityClient(mockApiKey);

        // mock actions for each methods
        jest.spyOn(HelperFunctions, 'generateRandomID').mockReturnValue(mockRandomId);
        FormData.mockImplementation(() => mockFormData);
        
        const mockFileStream = {
            on: jest.fn(),
            pipe: jest.fn(),
            destroy: jest.fn()
        };
        createReadStreamSpy = jest.spyOn(fs, 'createReadStream').mockReturnValue(mockFileStream);
        jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

        const mockResponse = {
            status: 200,
            data: mockResponseBuffer
        };
        mockHttpClient.postForm.mockResolvedValue(mockResponse);
    });
    afterEach(() => {
        createReadStreamSpy.mockRestore();
        jest.clearAllMocks();
    });
  
    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(stabilityClient).toBeInstanceOf(StabilityClient);
            expect(stabilityClient.aiName).toBe('Stability');
            expect(stabilityClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                ...mockBaseHeaders
            });
        });
    });


    describe("Use each method individually", () => {
        describe("Client ID, User ID and Version methods", () => {
            it("Test call 'setClientId' method", () => {
                const clientID = 'test-client-id-16-characters';
                stabilityClient.setClientId(clientID);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                    ...mockBaseHeaders,
                    'stability-client-id': clientID
                });
            });
            it("Test call 'setClientUserId' method", async () => {
                const clientUserID = 'test-client-user-id';
                stabilityClient.setClientUserId(clientUserID);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                    ...mockBaseHeaders,
                    'stability-client-user-id': clientUserID
                });
            });
            it("Test call 'setClientVersion' method", async () => {
                const clientVersion = 'test-client-version';
                stabilityClient.setClientVersion(clientVersion);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                    ...mockBaseHeaders,
                    'stability-client-version': clientVersion
                });
            });
        });

        describe("Generate image methods", () => {
            it("Test call 'generateImageUltra' method", async () => {
                jest.mock('fs');
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.generateImageUltra(prompt, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/generate/ultra',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'generateImageCore' method", async () => {
                jest.mock('fs');
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.generateImageCore(prompt, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/generate/core',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'generateImageDiffusion' method", async () => {
                jest.mock('fs');
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const strength = 0.5;
                const modelID = "test-model-id";
                const mode = "mode-test";
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.generateImageDiffusion(prompt, destinationFolder, strength, modelID, mode, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
        });

        describe("Upscale image methods", () => {
            it("Test call 'upscaleConservative' method", async () => {
                jest.mock('fs');
                const prompt = 'a flower';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { creativity: 0.35 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.upscaleConservative(prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/upscale/conservative',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'upscaleCreative' method", async () => {
                jest.mock('fs');
                const prompt = 'cute fluffy white kitten floating in space, pastel colors';
                const pathImage = '/path/to/image/file.jpg';
                const output_format = 'png';
                const config = { creativity: 0.35 };
                const mockResponse = { data: { id: "id-test-from-response" } };
                mockHttpClient.postForm.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.upscaleCreative(prompt, pathImage, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                expect(result).toEqual({ image_id: mockResponse.data.id });
            });
            it("Test call 'getUpscaleCreative' method", async () => {
                jest.mock('fs');
                const upscaleId = 'video-test-id';
                const destinationFolder = '/test_folder';

                let mockResponse = {
                    status: 200,
                    data: mockResponseBuffer,
                    headers: {
                        'content-type': 'image/jpeg'
                    }
                };
                mockHttpClient.getFull.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.getUpscaleCreative(upscaleId, destinationFolder);
                expect(stabilityClient.httpRequest.getFull).toHaveBeenCalledWith(
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

                mockResponse = { image_path: `.${destinationFolder}/${upscaleId}.jpeg` };
                expect(fs.promises.writeFile).toHaveBeenCalledWith(
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'getUpscaleCreative' method and handle pending status", async () => {
                jest.mock('fs');
                const upscaleId = 'video-test-id';
                const destinationFolder = '/test_folder';

                let mockResponse = {
                    status: 202
                };
                mockHttpClient.getFull.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.getUpscaleCreative(upscaleId, destinationFolder);
                expect(stabilityClient.httpRequest.getFull).toHaveBeenCalledWith(
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
                expect(result).toEqual({ status: "Generation is still running, try again in 10 seconds" });
            });

            it("Test call 'upscaleFast' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.upscaleFast(pathImage, destinationFolder, output_format);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/upscale/fast',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
        });

        describe("Edit image methods", () => {
            it("Test call 'erase' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.erase(pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/edit/erase',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'inpaint' method", async () => {
                jest.mock('fs');
                const prompt = 'dog wearing black glasses';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.inpaint(prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/edit/inpaint',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'outpaint' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.outpaint(pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'searchAndReplace' method", async () => {
                jest.mock('fs');
                const prompt = 'golden retriever standing in a field';
                const search_prompt = 'dog';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/edit/search-and-replace',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'searchAndRecolor' method", async () => {
                jest.mock('fs');
                const prompt = 'a yellow car';
                const select_prompt = 'car';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'removeBackground' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.removeBackground(pathImage, destinationFolder, output_format);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/edit/remove-background',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
        });

        describe("Control image methods", () => {
            it("Test call 'controlSketch' method", async () => {
                jest.mock('fs');
                const prompt = 'a medieval castle on a hill';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { control_strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.controlSketch(prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'controlStructure' method", async () => {
                jest.mock('fs');
                const prompt = 'a well manicured shrub in an english garden';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { control_strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.controlStructure(prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/control/structure',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'controlStyle' method", async () => {
                jest.mock('fs');
                const prompt = 'a majestic portrait of a chicken';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/${mockRandomId}.${output_format}` };
                
                const result = await stabilityClient.controlStyle(prompt, pathImage, destinationFolder, output_format, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
                    '/stable-image/control/style',
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
                    mockResponse.image_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
        });

        describe("3D video methods", () => {
            it("Test call 'videoStableFast' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const config = { remesh: 'none' };
                const mockResponse = { video_path: `.${destinationFolder}/${mockRandomId}.gbl` };
                
                const result = await stabilityClient.videoStableFast(pathImage, destinationFolder, config);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                    mockResponse.video_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'imageToVideo' method", async () => {
                jest.mock('fs');
                const pathImage = '/path/to/image/file.jpg';
                const cfg_scale = 1.5;
                const motion_bucket_id =  124;
                const seed = 0.1;
                const mockResponse = { data: { id: "id-test-from-response" } };
                mockHttpClient.postForm.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.imageToVideo(pathImage, cfg_scale, motion_bucket_id, seed);
                expect(stabilityClient.httpRequest.postForm).toHaveBeenCalledWith(
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
                expect(result).toEqual({ video_generated_id: mockResponse.data.id });
            });
            it("Test call 'getImageToVideo' method", async () => {
                jest.mock('fs');
                const videoId = 'video-test-id';
                const destinationFolder = '/test_folder';

                let mockResponse = {
                    status: 200,
                    data: mockResponseBuffer
                };
                mockHttpClient.getFull.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.getImageToVideo(videoId, destinationFolder);
                expect(stabilityClient.httpRequest.getFull).toHaveBeenCalledWith(
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

                mockResponse = { video_path: `.${destinationFolder}/${videoId}.mp4` };
                expect(fs.promises.writeFile).toHaveBeenCalledWith(
                    mockResponse.video_path,
                    mockResponseBuffer
                );
                expect(result).toEqual(mockResponse);
            });
            it("Test call 'getImageToVideo' method and handle pending status", async () => {
                jest.mock('fs');
                const videoId = 'video-test-id';
                const destinationFolder = '/test_folder';

                let mockResponse = {
                    status: 202
                };
                mockHttpClient.getFull.mockResolvedValue(mockResponse);
                
                const result = await stabilityClient.getImageToVideo(videoId, destinationFolder);
                expect(stabilityClient.httpRequest.getFull).toHaveBeenCalledWith(
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
                expect(result).toEqual({ status: "Generation is still running, try again in 10 seconds" });
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.getFull.mockRejectedValue(new Error('API Error'));
            mockHttpClient.postForm.mockRejectedValue(new Error('API Error'));
        });
        it("Test when client ID is not provided or invalid", () => {
            expect(() => stabilityClient.setClientId()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientId(123)).toThrow(AIConnectifyError);
        });
        it("Test when client user ID is not provided or invalid", () => {
            expect(() => stabilityClient.setClientUserId()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientUserId(123)).toThrow(AIConnectifyError);
        });
        it("Test when client version is not provided or invalid", () => {
            expect(() => stabilityClient.setClientVersion()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientVersion(123)).toThrow(AIConnectifyError);
        });
        
        it("Test when 'generateImageUltra' request failure", async () => {
            await expect(stabilityClient.generateImageUltra()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageUltra('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageUltra(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.generateImageUltra('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageUltra('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.generateImageUltra('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.generateImageUltra('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageUltra('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageUltra('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'generateImageCore' request failure", async () => {
            await expect(stabilityClient.generateImageCore()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageCore('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageCore(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.generateImageCore('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageCore('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.generateImageCore('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.generateImageCore('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageCore('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageCore('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'generateImageDiffusion' request failure", async () => {
            await expect(stabilityClient.generateImageDiffusion()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageDiffusion(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.generateImageDiffusion('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('test', 'test', '')).rejects.toThrow('Cannot process the strength value');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', '123')).rejects.toThrow('Cannot process the strength value');

            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123)).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, '')).rejects.toThrow('Cannot process the model ID');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 123)).rejects.toThrow('Cannot process the model ID');

            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test', '')).rejects.toThrow('Cannot process the mode');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test', 123)).rejects.toThrow('Cannot process the mode');

            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 123, 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.generateImageDiffusion('test', undefined, 123, 'test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion('test', '', 123, 'test', 'test', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageDiffusion('test', 123, 123, 'test', 'test', 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'upscaleConservative' request failure", async () => {
            await expect(stabilityClient.upscaleConservative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.upscaleConservative(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.upscaleConservative('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleConservative('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.upscaleConservative('test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.upscaleConservative('test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.upscaleConservative('test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.upscaleConservative('test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'upscaleCreative' request failure", async () => {
            await expect(stabilityClient.upscaleConservative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.upscaleConservative(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.upscaleConservative('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleConservative('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.upscaleConservative('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.upscaleConservative('test', 'test', 123)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'getUpscaleCreative' request failure", async () => {
            await expect(stabilityClient.getUpscaleCreative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getUpscaleCreative('')).rejects.toThrow('Cannot process the upscale ID');
            await expect(stabilityClient.getUpscaleCreative(123)).rejects.toThrow('Cannot process the upscale ID');

            await expect(stabilityClient.getUpscaleCreative('test', undefined)).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getUpscaleCreative('test', '')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.getUpscaleCreative('test', 123)).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'upscaleFast' request failure", async () => {
            await expect(stabilityClient.upscaleFast()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleFast('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleFast(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.upscaleFast('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleFast('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.upscaleFast('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.upscaleFast('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleFast('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.upscaleFast('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'erase' request failure", async () => {
            await expect(stabilityClient.erase()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.erase('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.erase(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.erase('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.erase('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.erase('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.erase('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.erase('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.erase('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'inpaint' request failure", async () => {
            await expect(stabilityClient.inpaint()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.inpaint('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.inpaint(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.inpaint('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.inpaint('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.inpaint('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.inpaint('test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.inpaint('test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.inpaint('test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.inpaint('test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.inpaint('test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.inpaint('test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'outpaint' request failure", async () => {
            await expect(stabilityClient.outpaint()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.outpaint('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.outpaint(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.outpaint('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.outpaint('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.outpaint('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.outpaint('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.outpaint('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.outpaint('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'searchAndReplace' request failure", async () => {
            await expect(stabilityClient.searchAndReplace()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.searchAndReplace(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.searchAndReplace('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace('test', '')).rejects.toThrow('Cannot process the search prompt');
            await expect(stabilityClient.searchAndReplace('test', 123)).rejects.toThrow('Cannot process the search prompt');

            await expect(stabilityClient.searchAndReplace('test', 'test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace('test', 'test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.searchAndReplace('test', 'test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'searchAndRecolor' request failure", async () => {
            await expect(stabilityClient.searchAndRecolor()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.searchAndRecolor(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.searchAndRecolor('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor('test', '')).rejects.toThrow('Cannot process the select prompt');
            await expect(stabilityClient.searchAndRecolor('test', 123)).rejects.toThrow('Cannot process the select prompt');

            await expect(stabilityClient.searchAndRecolor('test', 'test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor('test', 'test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'removeBackground' request failure", async () => {
            await expect(stabilityClient.removeBackground()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.removeBackground('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.removeBackground(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.removeBackground('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.removeBackground('test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.removeBackground('test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.removeBackground('test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.removeBackground('test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.removeBackground('test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'controlSketch' request failure", async () => {
            await expect(stabilityClient.controlSketch()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlSketch('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.controlSketch(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.controlSketch('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlSketch('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.controlSketch('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.controlSketch('test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlSketch('test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.controlSketch('test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.controlSketch('test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlSketch('test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.controlSketch('test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'controlStructure' request failure", async () => {
            await expect(stabilityClient.controlStructure()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStructure('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.controlStructure(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.controlStructure('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStructure('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.controlStructure('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.controlStructure('test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStructure('test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.controlStructure('test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.controlStructure('test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStructure('test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.controlStructure('test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'controlStyle' request failure", async () => {
            await expect(stabilityClient.controlStyle()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStyle('')).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.controlStyle(123)).rejects.toThrow('Cannot process the prompt');

            await expect(stabilityClient.controlStyle('test', )).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStyle('test', '')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.controlStyle('test', 123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.controlStyle('test', 'test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStyle('test', 'test', 'test', '')).rejects.toThrow('Cannot process the output format');
            await expect(stabilityClient.controlStyle('test', 'test', 'test', 123)).rejects.toThrow('Cannot process the output format');

            await expect(stabilityClient.controlStyle('test', 'test', undefined, 'test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStyle('test', 'test', '', 'test')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.controlStyle('test', 'test', 123, 'test')).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'videoStableFast' request failure", async () => {
            await expect(stabilityClient.videoStableFast()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.videoStableFast('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.videoStableFast(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.videoStableFast('test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.videoStableFast('test', '')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.videoStableFast('test', 123)).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'imageToVideo' request failure", async () => {
            await expect(stabilityClient.imageToVideo()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.imageToVideo('')).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.imageToVideo(123)).rejects.toThrow('Cannot process the image path folder');

            await expect(stabilityClient.imageToVideo('test')).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.imageToVideo('test', '')).rejects.toThrow('Cannot process the cfg scale');
            await expect(stabilityClient.imageToVideo('test', '123')).rejects.toThrow('Cannot process the cfg scale');

            await expect(stabilityClient.imageToVideo('test', 123)).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.imageToVideo('test', 123, '')).rejects.toThrow('Cannot process the motion bucket ID');
            await expect(stabilityClient.imageToVideo('test', 123, '123')).rejects.toThrow('Cannot process the motion bucket ID');

            await expect(stabilityClient.imageToVideo('test', 123, 123)).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.imageToVideo('test', 123, 123, '')).rejects.toThrow('Cannot process the seed');
            await expect(stabilityClient.imageToVideo('test', 123, 123, '123')).rejects.toThrow('Cannot process the seed');
        });
        it("Test when 'getImageToVideo' request failure", async () => {
            await expect(stabilityClient.getImageToVideo()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getImageToVideo('')).rejects.toThrow('Cannot process the video ID');
            await expect(stabilityClient.getImageToVideo(123)).rejects.toThrow('Cannot process the video ID');

            await expect(stabilityClient.getImageToVideo('test', undefined)).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getImageToVideo('test', '')).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.getImageToVideo('test', 123)).rejects.toThrow('Cannot process the destination folder');
        });
    });
});