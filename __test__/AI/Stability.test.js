import Stability from '../../lib/connectors/AI/Stability/Stability';
import StabilityClient from '../../lib/connectors/AI/Stability/StabilityClient';
import AIConnectifyError from '../../lib/AIConnectifyError';

jest.mock('../../lib/connectors/AI/Stability/StabilityClient');

describe("Stability class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let stability;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setClientId: jest.fn(),
            setClientUserId: jest.fn(),
            setClientVersion: jest.fn(),
            generateImageUltra: jest.fn(),
            generateImageCore: jest.fn(),
            generateImageDiffusion: jest.fn(),
            upscaleConservative: jest.fn(),
            upscaleCreative: jest.fn(),
            getUpscaleCreative: jest.fn(),
            upscaleFast: jest.fn(),
            erase: jest.fn(),
            inpaint: jest.fn(),
            outpaint: jest.fn(),
            searchAndReplace: jest.fn(),
            searchAndRecolor: jest.fn(),
            removeBackground: jest.fn(),
            controlSketch: jest.fn(),
            controlStructure: jest.fn(),
            constrolStyle: jest.fn(),
            videoStableFast: jest.fn(),
            imageToVideo: jest.fn(),
            getImageToVideo: jest.fn()
        };
        StabilityClient.mockImplementation(() => mockClientInstance);
        stability = new Stability(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(stability).toBeInstanceOf(Stability);
            expect(StabilityClient).toHaveBeenCalledWith(mockApiKey);
        });
    });

    describe("Use each method individually", () => {
        describe("Client ID, User ID and Version methods", () => {
            it("Test call 'setClientId' on the client instance", () => {
                const clientID = 'client-id';
                stability.setClientId(clientID);
                expect(mockClientInstance.setClientId).toHaveBeenCalledWith(clientID);
            });
            it("Test call 'setClientUserId' on the client instance", async () => {
                const clientUserID = 'client-user-id';
                stability.setClientUserId(clientUserID);
                expect(mockClientInstance.setClientUserId).toHaveBeenCalledWith(clientUserID);
            });
            it("Test call 'setClientVersion' on the client instance", async () => {
                const clientVersion = 'client-version';
                stability.setClientVersion(clientVersion);
                expect(mockClientInstance.setClientVersion).toHaveBeenCalledWith(clientVersion);
            });
        });

        describe("Generate image methods", () => {
            const prompt = 'test prompt';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            it("Test call 'generateImageUltra' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.generateImageUltra.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageUltra(prompt, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageUltra).toHaveBeenCalledWith(prompt, destinationFolder, output_format, config);
            });
            it("Test call 'generateImageCore' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.generateImageCore.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageCore(prompt, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageCore).toHaveBeenCalledWith(prompt, destinationFolder, output_format, config);
            });
            it("Test call 'generateImageDiffusion' on the client instance", async () => {
                const pathImage = '/path/to/image/original.jpg';
                const strength = 0;
                const modelID = 'test-model';
                const mode = 'text-to-image';
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.generateImageDiffusion.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageDiffusion(prompt, pathImage, destinationFolder, strength, modelID, mode, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageDiffusion).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, strength, modelID, mode, output_format, config);
            });
        });

        describe("Upscale image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/original.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            it("Test call 'upscaleConservative' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.upscaleConservative.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleConservative(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleConservative).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'upscaleCreative' on the client instance", async () => {
                const mockResponse = { image_id: 'random-id' };
                mockClientInstance.upscaleCreative.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleCreative(prompt, pathImage, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleCreative).toHaveBeenCalledWith(prompt, pathImage, output_format, config);
            });
            it("Test call 'getUpscaleCreative' on the client instance", async () => {
                const upscaleId = 'upscale-image-id';
                const mockResponse = { image_path: `${destinationFolder}/${upscaleId}.${output_format}` };
                mockClientInstance.getUpscaleCreative.mockResolvedValue(mockResponse);
                
                const result = await stability.getUpscaleCreative(upscaleId, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getUpscaleCreative).toHaveBeenCalledWith(upscaleId, destinationFolder, output_format, config);
            });
            it("Test call 'upscaleFast' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.upscaleFast.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleFast(pathImage, destinationFolder, output_format);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleFast).toHaveBeenCalledWith(pathImage, destinationFolder, output_format);
            });
        });

        describe("Edit image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/original.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            it("Test call 'erase' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.erase.mockResolvedValue(mockResponse);
                
                const result = await stability.erase(pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.erase).toHaveBeenCalledWith(pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'inpaint' on the client instance", async () => {
                const mockResponse = { image_id: 'random-id' };
                mockClientInstance.inpaint.mockResolvedValue(mockResponse);
                
                const result = await stability.inpaint(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.inpaint).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'outpaint' on the client instance", async () => {
                const directions = { left:0, right:0, up:0, down:0 };
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.outpaint.mockResolvedValue(mockResponse);
                
                const result = await stability.outpaint(pathImage, destinationFolder, directions, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.outpaint).toHaveBeenCalledWith(pathImage, destinationFolder, directions, output_format, config);
            });
            it("Test call 'searchAndReplace' on the client instance", async () => {
                const search_prompt = 'search prompt test';
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.searchAndReplace.mockResolvedValue(mockResponse);
                
                const result = await stability.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.searchAndReplace).toHaveBeenCalledWith(prompt, search_prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'searchAndRecolor' on the client instance", async () => {
                const select_prompt = 'select prompt test';
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.searchAndRecolor.mockResolvedValue(mockResponse);
                
                const result = await stability.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.searchAndRecolor).toHaveBeenCalledWith(prompt, select_prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'removeBackground' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.removeBackground.mockResolvedValue(mockResponse);
                
                const result = await stability.removeBackground(pathImage, destinationFolder, output_format);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.removeBackground).toHaveBeenCalledWith(pathImage, destinationFolder, output_format);
            });
        });

        describe("Control image methods", () => {
            const prompt = 'test prompt';
            const pathImage = '/path/to/image/image.jpg';
            const destinationFolder = '/path/to/image';
            const output_format = 'jpg';
            const config = { aspect_ratio: '16:9' };

            it("Test call 'controlSketch' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.controlSketch.mockResolvedValue(mockResponse);
                
                const result = await stability.controlSketch(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.controlSketch).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'controlStructure' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.controlStructure.mockResolvedValue(mockResponse);
                
                const result = await stability.controlStructure(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.controlStructure).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'constrolStyle' on the client instance", async () => {
                const mockResponse = { image_path: `${destinationFolder}/random_name.${output_format}` };
                mockClientInstance.constrolStyle.mockResolvedValue(mockResponse);
                
                const result = await stability.constrolStyle(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.constrolStyle).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
        });

        describe("3D video methods", () => {
            const pathImage = '/path/to/image/image.jpg';
            const destinationFolder = '/path/to/image';

            it("Test call 'videoStableFast' on the client instance", async () => {
                const config = { remesh: 'triangle' };
                const mockResponse = { video_path: `${destinationFolder}/random_name.glb` };
                mockClientInstance.videoStableFast.mockResolvedValue(mockResponse);
                
                const result = await stability.videoStableFast(pathImage, destinationFolder, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.videoStableFast).toHaveBeenCalledWith(pathImage, destinationFolder, config);
            });
            it("Test call 'imageToVideo' on the client instance", async () => {
                const cfg_scale = 1.8;
                const motion_bucket_id = 127;
                const config = { seed: 0 };
                const mockResponse = { video_generated_id: 'video-generated-id' };
                mockClientInstance.imageToVideo.mockResolvedValue(mockResponse);
                
                const result = await stability.imageToVideo(pathImage, destinationFolder, cfg_scale, motion_bucket_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.imageToVideo).toHaveBeenCalledWith(pathImage, destinationFolder, cfg_scale, motion_bucket_id, config);
            });
            it("Test call 'getImageToVideo' on the client instance", async () => {
                const videoId = 'video-generated-id';
                const mockResponse = { video_path: `${destinationFolder}/${videoId}.mp4` };
                mockClientInstance.getImageToVideo.mockResolvedValue(mockResponse);
                
                const result = await stability.getImageToVideo(videoId, destinationFolder);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getImageToVideo).toHaveBeenCalledWith(videoId, destinationFolder);
            });
        });
    });

    describe("AIConnectifyError is throw in methods", () => {
        it("Tests when API key is not provided", () => {
            expect(() => new Stability()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new Stability('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });
});