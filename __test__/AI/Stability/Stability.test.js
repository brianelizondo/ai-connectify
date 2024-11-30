import Stability from '../../../lib/connectors/AI/Stability/Stability';
import StabilityClient from '../../../lib/connectors/AI/Stability/StabilityClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';

jest.mock('../../../lib/connectors/AI/Stability/StabilityClient');

describe("Stability class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let stability;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setClientId: jest.fn(),
            setClientUserId: jest.fn(),
            setClientVersion: jest.fn(),
            controlStructure: jest.fn(),
            controlSketch: jest.fn(),
            controlStyle: jest.fn(),
            erase: jest.fn(),
            generateImageCore: jest.fn(),
            generateImageDiffusion: jest.fn(),
            generateImageUltra: jest.fn(),
            getImageToVideo: jest.fn(),
            getUpscaleCreative: jest.fn(),
            imageToVideo: jest.fn(),
            inpaint: jest.fn(),
            outpaint: jest.fn(),
            removeBackground: jest.fn(),
            searchAndRecolor: jest.fn(),
            searchAndReplace: jest.fn(),
            upscaleConservative: jest.fn(),
            upscaleCreative: jest.fn(),
            upscaleFast: jest.fn(),
            videoStableFast: jest.fn()
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
                const clientID = 'test-client-id';
                stability.setClientId(clientID);
                expect(mockClientInstance.setClientId).toHaveBeenCalledWith(clientID);
            });
            it("Test call 'setClientUserId' on the client instance", async () => {
                const clientUserID = 'test-client-user-id';
                stability.setClientUserId(clientUserID);
                expect(mockClientInstance.setClientUserId).toHaveBeenCalledWith(clientUserID);
            });
            it("Test call 'setClientVersion' on the client instance", async () => {
                const clientVersion = 'test-client-version';
                stability.setClientVersion(clientVersion);
                expect(mockClientInstance.setClientVersion).toHaveBeenCalledWith(clientVersion);
            });
        });

        describe("Generate image methods", () => {
            it("Test call 'generateImageUltra' on the client instance", async () => {
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.generateImageUltra.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageUltra(prompt, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageUltra).toHaveBeenCalledWith(prompt, destinationFolder, output_format, config);
            });
            it("Test call 'generateImageCore' on the client instance", async () => {
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.generateImageCore.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageCore(prompt, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageCore).toHaveBeenCalledWith(prompt, destinationFolder, output_format, config);
            });
            it("Test call 'generateImageDiffusion' on the client instance", async () => {
                const prompt = 'a medieval castle on a hill';
                const destinationFolder = '/test_folder';
                const strength = 0.5;
                const modelID = "test-model-id";
                const mode = "mode-test";
                const output_format = 'png';
                const config = { strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.generateImageDiffusion.mockResolvedValue(mockResponse);
                
                const result = await stability.generateImageDiffusion(prompt, destinationFolder, strength, modelID, mode, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.generateImageDiffusion).toHaveBeenCalledWith(prompt, destinationFolder, strength, modelID, mode, output_format, config);
            });
        });

        describe("Upscale image methods", () => {
            it("Test call 'upscaleConservative' on the client instance", async () => {
                const prompt = 'a flower';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { creativity: 0.35 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.upscaleConservative.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleConservative(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleConservative).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'upscaleCreative' on the client instance", async () => {
                const prompt = 'cute fluffy white kitten floating in space, pastel colors';
                const pathImage = '/path/to/image/file.jpg';
                const output_format = 'png';
                const config = { creativity: 0.35 };
                const mockResponse = { data: { id: "id-test-from-response" } };
                mockClientInstance.upscaleCreative.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleCreative(prompt, pathImage, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleCreative).toHaveBeenCalledWith(prompt, pathImage, output_format, config);
            });
            it("Test call 'getUpscaleCreative' on the client instance", async () => {
                const upscaleId = 'video-test-id';
                const destinationFolder = '/test_folder';
                const mockResponse = { image_path: `.${destinationFolder}/${upscaleId}.jpeg` };
                mockClientInstance.getUpscaleCreative.mockResolvedValue(mockResponse);
                
                const result = await stability.getUpscaleCreative(upscaleId, destinationFolder);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getUpscaleCreative).toHaveBeenCalledWith(upscaleId, destinationFolder);
            });
            it("Test call 'upscaleFast' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.upscaleFast.mockResolvedValue(mockResponse);
                
                const result = await stability.upscaleFast(pathImage, destinationFolder, output_format);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.upscaleFast).toHaveBeenCalledWith(pathImage, destinationFolder, output_format);
            });
        });

        describe("Edit image methods", () => {
            it("Test call 'erase' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `${destinationFolder}/random123.${output_format}` };
                mockClientInstance.erase.mockResolvedValue(mockResponse);
                
                const result = await stability.erase(pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.erase).toHaveBeenCalledWith(pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'inpaint' on the client instance", async () => {
                const prompt = 'dog wearing black glasses';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.inpaint.mockResolvedValue(mockResponse);
                
                const result = await stability.inpaint(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.inpaint).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'outpaint' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.outpaint.mockResolvedValue(mockResponse);
                
                const result = await stability.outpaint(pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.outpaint).toHaveBeenCalledWith(pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'searchAndReplace' on the client instance", async () => {
                const prompt = 'golden retriever standing in a field';
                const search_prompt = 'dog';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.searchAndReplace.mockResolvedValue(mockResponse);
                
                const result = await stability.searchAndReplace(prompt, search_prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.searchAndReplace).toHaveBeenCalledWith(prompt, search_prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'searchAndRecolor' on the client instance", async () => {
                const prompt = 'a yellow car';
                const select_prompt = 'car';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { grow_mask: 10 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.searchAndRecolor.mockResolvedValue(mockResponse);
                
                const result = await stability.searchAndRecolor(prompt, select_prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.searchAndRecolor).toHaveBeenCalledWith(prompt, select_prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'removeBackground' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.removeBackground.mockResolvedValue(mockResponse);
                
                const result = await stability.removeBackground(pathImage, destinationFolder, output_format);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.removeBackground).toHaveBeenCalledWith(pathImage, destinationFolder, output_format);
            });
        });

        describe("Control image methods", () => {
            it("Test call 'controlSketch' on the client instance", async () => {
                const prompt = 'a medieval castle on a hill';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { control_strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.controlSketch.mockResolvedValue(mockResponse);
                
                const result = await stability.controlSketch(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.controlSketch).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'controlStructure' on the client instance", async () => {
                const prompt = 'a well manicured shrub in an english garden';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { control_strength: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.controlStructure.mockResolvedValue(mockResponse);
                
                const result = await stability.controlStructure(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.controlStructure).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
            it("Test call 'controlStyle' on the client instance", async () => {
                const prompt = 'a majestic portrait of a chicken';
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const output_format = 'png';
                const config = { fidelity: 0.7 };
                const mockResponse = { image_path: `.${destinationFolder}/random123.${output_format}` };
                mockClientInstance.controlStyle.mockResolvedValue(mockResponse);
                
                const result = await stability.controlStyle(prompt, pathImage, destinationFolder, output_format, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.controlStyle).toHaveBeenCalledWith(prompt, pathImage, destinationFolder, output_format, config);
            });
        });

        describe("3D video methods", () => {
            it("Test call 'videoStableFast' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const destinationFolder = '/test_folder';
                const config = { remesh: 'none' };
                const mockResponse = { video_path: `.${destinationFolder}/random123.gbl` };
                mockClientInstance.videoStableFast.mockResolvedValue(mockResponse);
                
                const result = await stability.videoStableFast(pathImage, destinationFolder, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.videoStableFast).toHaveBeenCalledWith(pathImage, destinationFolder, config);
            });
            it("Test call 'imageToVideo' on the client instance", async () => {
                const pathImage = '/path/to/image/file.jpg';
                const cfg_scale = 1.5;
                const motion_bucket_id =  124;
                const seed = 0.1;
                const mockResponse = { data: { id: "id-test-from-response" } };
                mockClientInstance.imageToVideo.mockResolvedValue(mockResponse);
                
                const result = await stability.imageToVideo(pathImage, cfg_scale, motion_bucket_id, seed);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.imageToVideo).toHaveBeenCalledWith(pathImage, cfg_scale, motion_bucket_id, seed);
            });
            it("Test call 'getImageToVideo' on the client instance", async () => {
                const videoId = 'video-test-id';
                const destinationFolder = '/test_folder';
                const mockResponse = { video_path: `.${destinationFolder}/${videoId}.mp4` };
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