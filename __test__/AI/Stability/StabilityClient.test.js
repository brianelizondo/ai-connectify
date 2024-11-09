import fs from 'fs';
import FormData from 'form-data';
import AIConnectifyError from '../../lib/AIConnectifyError';
import HttpClient from '../../lib/connectors/HttpClient/HttpClient';
import StabilityClient from '../../lib/connectors/AI/Stability/StabilityClient';

jest.mock('../../lib/connectors/HttpClient/HttpClient');
jest.mock('fs');
jest.mock('form-data');

describe("StabilityClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.stability.ai/v2beta";
    let stabilityClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        stabilityClient = new StabilityClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(stabilityClient).toBeInstanceOf(StabilityClient);
            expect(stabilityClient.aiName).toBe('Stability');
            expect(stabilityClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
                'Content-Type': 'multipart/form-data'
            });
        });
    });


    describe("Use each method individually", () => {
        describe("Client ID, User ID and Version methods", () => {
            it("Test call 'setClientId' method", () => {
                const clientID = 'test-client-id-16-characters';
                stabilityClient.setClientId(clientID);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                        Authorization: `Bearer ${mockApiKey}`,
                        'Content-Type': 'multipart/form-data',
                        'stability-client-id': clientID
                });
            });
            it("Test call 'setClientUserId' method", async () => {
                const clientUserID = 'test-client-user-id';
                stabilityClient.setClientUserId(clientUserID);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                        Authorization: `Bearer ${mockApiKey}`,
                        'Content-Type': 'multipart/form-data',
                        'stability-client-user-id': clientUserID
                });
            });
            it("Test call 'setClientVersion' method", async () => {
                const clientVersion = 'test-client-version';
                stabilityClient.setClientVersion(clientVersion);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                        Authorization: `Bearer ${mockApiKey}`,
                        'Content-Type': 'multipart/form-data',
                        'stability-client-version': clientVersion
                });
            });
        });

        describe("Generate image methods", () => {
            const prompt = 'test prompt';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            beforeEach(() => {
                fs.createReadStream.mockReturnValue('mock-file-stream');
                fs.writeFileSync.mockImplementation(() => {});

                FormData.prototype.append = jest.fn();
                FormData.prototype.getHeaders = jest.fn().mockReturnValue({});

                const mockResponse = {
                    data: Buffer.from('mock-image-data'),
                    status: 200
                };
                mockHttpClient.post.mockResolvedValue(mockResponse);
                mockHttpClient.get.mockResolvedValue(mockResponse);
            });

            it("Test call 'generateImageUltra' method", async () => {
                const result = await stabilityClient.generateImageUltra(prompt, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/generate/ultra',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'generateImageCore' method", async () => {
                const result = await stabilityClient.generateImageCore(prompt, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/generate/core',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'generateImageDiffusion' method", async () => {
                const pathImage = '/path/to/image/original.jpg';
                const strength = 0.5;
                const modelID = 'test-model';
                const mode = 'text-to-image';

                const result = await stabilityClient.generateImageDiffusion(prompt, pathImage, destinationFolder, strength, modelID, mode, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/generate/sd3',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
        });

        describe("Upscale image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/original.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };
            
            beforeEach(() => {
                fs.createReadStream.mockReturnValue('mock-file-stream');
                fs.writeFileSync.mockImplementation(() => {});
                FormData.prototype.append = jest.fn();
                FormData.prototype.getHeaders = jest.fn().mockReturnValue({});
    
                const mockResponse = {
                    data: Buffer.from('mock-image-data'),
                    status: 200
                };
                mockHttpClient.post.mockResolvedValue(mockResponse);
                mockHttpClient.get.mockResolvedValue(mockResponse);
            });

            it("Test call 'upscaleConservative' method", async () => {
                const result = await stabilityClient.upscaleConservative(prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/upscale/conservative',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'upscaleCreative' method", async () => {
                mockHttpClient.post.mockResolvedValue({ data: { id: 'test-id' } });
                const result = await stabilityClient.upscaleCreative(prompt, pathImage, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/upscale/creative',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_id');
            });
            it("Test call 'getUpscaleCreative' method", async () => {
                const upscaleId = 'upscale-image-id';
                mockHttpClient.get.mockResolvedValue({
                    status: 200,
                    data: Buffer.from('mock-image-data')
                });

                const result = await stabilityClient.getUpscaleCreative(upscaleId, destinationFolder, output_format, config);

                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'getUpscaleCreative' method and handle pending status", async () => {
                const upscaleId = 'upscale-image-id';
                mockHttpClient.get.mockResolvedValue({ status: 202 });
                const result = await stabilityClient.getUpscaleCreative(upscaleId, destinationFolder, output_format, config);

                expect(result).toEqual({ status: 'Generation is still running, try again in 10 seconds' });
            });

            it("Test call 'upscaleFast' method", async () => {
                const result = await stabilityClient.upscaleFast(pathImage, destinationFolder, output_format);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/upscale/fast',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
        });

        describe("Edit image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/original.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            beforeEach(() => {
                fs.createReadStream.mockReturnValue('mock-file-stream');
                fs.writeFileSync.mockImplementation(() => {});
                FormData.prototype.append = jest.fn();
                FormData.prototype.getHeaders = jest.fn().mockReturnValue({});
    
                const mockResponse = {
                    data: Buffer.from('mock-image-data'),
                    status: 200
                };
                mockHttpClient.post.mockResolvedValue(mockResponse);
            });

            it("Test call 'erase' method", async () => {
                const result = await stabilityClient.erase(pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/erase',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'inpaint' method", async () => {
                const result = await stabilityClient.inpaint(prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/inpaint',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'outpaint' method", async () => {
                const directions = { left:0, right:0, up:0, down:0 };
                const result = await stabilityClient.outpaint(pathImage, destinationFolder, directions, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/outpaint',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'searchAndReplace' method", async () => {
                const search_prompt = 'search prompt test';
                const result = await stabilityClient.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/search-and-replace',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'searchAndRecolor' method", async () => {
                const select_prompt = 'search prompt test';
                const result = await stabilityClient.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/search-and-recolor',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'removeBackground' method", async () => {
                const result = await stabilityClient.removeBackground(pathImage, destinationFolder, output_format);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/edit/remove-background',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
        });

        describe("Control image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/image.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            beforeEach(() => {
                fs.createReadStream.mockReturnValue('mock-file-stream');
                fs.writeFileSync.mockImplementation(() => {});
                FormData.prototype.append = jest.fn();
                FormData.prototype.getHeaders = jest.fn().mockReturnValue({});
    
                const mockResponse = {
                    data: Buffer.from('mock-image-data'),
                    status: 200
                };
                mockHttpClient.post.mockResolvedValue(mockResponse);
            });

            it("Test call 'controlSketch' method", async () => {
                const result = await stabilityClient.controlSketch(prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/control/sketch',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'controlStructure' method", async () => {
                const result = await stabilityClient.controlStructure(prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/control/structure',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
            it("Test call 'constrolStyle' method", async () => {
                const result = await stabilityClient.constrolStyle(prompt, pathImage, destinationFolder, output_format, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/stable-image/control/style',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('image_path');
            });
        });

        describe("3D video methods", () => {
            const pathImage = '/path/to/image/image.jpg';
            const destinationFolder = '/path/to/image';

            beforeEach(() => {
                fs.createReadStream.mockReturnValue('mock-file-stream');
                fs.writeFileSync.mockImplementation(() => {});
                FormData.prototype.append = jest.fn();
                FormData.prototype.getHeaders = jest.fn().mockReturnValue({});
    
                const mockResponse = {
                    data: Buffer.from('mock-image-data'),
                    status: 200
                };
                mockHttpClient.post.mockResolvedValue(mockResponse);
            });

            it("Test call 'videoStableFast' method", async () => {
                const config = { remesh: 'triangle' };
                const result = await stabilityClient.videoStableFast(pathImage, destinationFolder, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/3d/stable-fast-3d',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('video_path');
            });
            it("Test call 'imageToVideo' method", async () => {
                const cfg_scale = 1.8;
                const motion_bucket_id = 127;
                const config = { seed: 0 };
                mockHttpClient.post.mockResolvedValue({ data: { id: 'test-id' } });

                const result = await stabilityClient.imageToVideo(pathImage, destinationFolder, cfg_scale, motion_bucket_id, config);

                expect(mockHttpClient.post).toHaveBeenCalledWith('/image-to-video',
                    expect.any(FormData),
                    expect.any(Object)
                );
                expect(result).toHaveProperty('video_generated_id');
            });
            it("Test call 'getImageToVideo' method and handle pending status", async () => {
                const videoId = 'video-generated-id';
                mockHttpClient.get.mockResolvedValue({ status: 202 });

                const result = await stabilityClient.getImageToVideo(videoId, destinationFolder);

                expect(result).toEqual({ status: 'Generation is still running, try again in 10 seconds' });
            });
            it("Test call 'getImageToVideo' method", async () => {
                const videoId = 'video-generated-id';
                mockHttpClient.get.mockResolvedValue({
                    status: 200,
                    data: Buffer.from('mock-video-data')
                });

                const result = await stabilityClient.getImageToVideo(videoId, destinationFolder);

                expect(result).toHaveProperty('video_path');
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
        });
        it("Test when client ID is not provided or invalid", () => {
            expect(() => stabilityClient.setClientId()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientId(123456)).toThrow(AIConnectifyError);
        });
        it("Test when client user ID is not provided or invalid", () => {
            expect(() => stabilityClient.setClientUserId()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientUserId(123456)).toThrow(AIConnectifyError);
        });
        it("Test when client version is not provided or invalid", () => {
            expect(() => stabilityClient.setClientVersion()).toThrow(AIConnectifyError);
            expect(() => stabilityClient.setClientVersion(123465)).toThrow(AIConnectifyError);
        });
        
        it("Test when 'generateImageUltra' request failure", async () => {
            await expect(stabilityClient.generateImageUltra()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageUltra(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageUltra('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageUltra('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'generateImageCore' request failure", async () => {
            await expect(stabilityClient.generateImageCore()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageCore(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageCore('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageCore('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'generateImageDiffusion' request failure", async () => {
            await expect(stabilityClient.generateImageDiffusion()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.generateImageDiffusion(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.generateImageDiffusion('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 'test', 'test')).rejects.toThrow('Cannot process the strength value');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 'test', 123456, 12345)).rejects.toThrow('Cannot process the model ID');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 'test', 123456, 'test', 12345)).rejects.toThrow('Cannot process the mode');
            await expect(stabilityClient.generateImageDiffusion('test', 'test', 'test', 123456, 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'upscaleConservative' request failure", async () => {
            await expect(stabilityClient.upscaleConservative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleConservative(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.upscaleConservative('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleConservative('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.upscaleConservative('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'upscaleCreative' request failure", async () => {
            await expect(stabilityClient.upscaleCreative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleCreative(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.upscaleCreative('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleCreative('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'getUpscaleCreative' request failure", async () => {
            await expect(stabilityClient.getUpscaleCreative()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getUpscaleCreative(12345)).rejects.toThrow('Cannot process the upscale ID');
            await expect(stabilityClient.getUpscaleCreative('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.getUpscaleCreative('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'upscaleFast' request failure", async () => {
            await expect(stabilityClient.upscaleFast()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.upscaleFast(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.upscaleFast('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.upscaleFast('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'erase' request failure", async () => {
            await expect(stabilityClient.erase()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.erase(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.erase('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.erase('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'inpaint' request failure", async () => {
            await expect(stabilityClient.inpaint()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.inpaint(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.inpaint('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.inpaint('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.inpaint('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'outpaint' request failure", async () => {
            await expect(stabilityClient.outpaint()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.outpaint(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.outpaint('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.outpaint('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'searchAndReplace' request failure", async () => {
            await expect(stabilityClient.searchAndReplace()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndReplace(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.searchAndReplace('test', 12345)).rejects.toThrow('Cannot process the search prompt');
            await expect(stabilityClient.searchAndReplace('test', 'test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.searchAndReplace('test', 'test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'searchAndRecolor' request failure", async () => {
            await expect(stabilityClient.searchAndRecolor()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.searchAndRecolor(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.searchAndRecolor('test', 12345)).rejects.toThrow('Cannot process the select prompt');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.searchAndRecolor('test', 'test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'removeBackground' request failure", async () => {
            await expect(stabilityClient.removeBackground()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.removeBackground(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.removeBackground('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.removeBackground('test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'controlSketch' request failure", async () => {
            await expect(stabilityClient.controlSketch()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlSketch(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.controlSketch('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.controlSketch('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.controlSketch('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'controlStructure' request failure", async () => {
            await expect(stabilityClient.controlStructure()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.controlStructure(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.controlStructure('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.controlStructure('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.controlStructure('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'constrolStyle' request failure", async () => {
            await expect(stabilityClient.constrolStyle()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.constrolStyle(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(stabilityClient.constrolStyle('test', 12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.constrolStyle('test', 'test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.constrolStyle('test', 'test', 'test', 12345)).rejects.toThrow('Cannot process the output format');
        });
        it("Test when 'videoStableFast' request failure", async () => {
            await expect(stabilityClient.videoStableFast()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.videoStableFast(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.videoStableFast('test', 12345)).rejects.toThrow('Cannot process the destination folder');
        });
        it("Test when 'imageToVideo' request failure", async () => {
            await expect(stabilityClient.imageToVideo()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.imageToVideo(12345)).rejects.toThrow('Cannot process the image path folder');
            await expect(stabilityClient.imageToVideo('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(stabilityClient.imageToVideo('test', 'test', 'test')).rejects.toThrow('Cannot process the cfg scale');
            await expect(stabilityClient.imageToVideo('test', 'test', 123456, 'test')).rejects.toThrow('Cannot process the motion bucket ID');
        });
        it("Test when 'getImageToVideo' request failure", async () => {
            await expect(stabilityClient.getImageToVideo()).rejects.toThrow(AIConnectifyError);
            await expect(stabilityClient.getImageToVideo(12345)).rejects.toThrow('Cannot process the video ID');
            await expect(stabilityClient.getImageToVideo('test', 12345)).rejects.toThrow('Cannot process the destination folder');
        });
    });
});