import fs from 'fs';
import FormData from 'form-data';
import AIConnectifyError from '../../lib/AIConnectifyError';
import HttpClient from '../../lib/connectors/HttpClient/HttpClient';
import DALLEClient from '../../lib/connectors/AI/DALLE/DALLEClient';

jest.mock('../../lib/connectors/HttpClient/HttpClient');
jest.mock('fs');

describe("DALLEClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.openai.com/v1";
    let dalleClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        dalleClient = new DALLEClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(dalleClient).toBeInstanceOf(DALLEClient);
            expect(dalleClient.aiName).toBe('DALL-E');
            expect(dalleClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
            });
        });
    });

    describe("Use each method individually", () => {
        it("Test use 'setOrganizationId' method", () => {
            const orgId = "org-TEST_ID_WITH_16_CHARACTERS";
            dalleClient.setOrganizationId(orgId);
            expect(dalleClient.organizationIDs['OpenAI-Organization']).toBe(orgId);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
                'OpenAI-Organization': orgId,
            });
        });
        it("Test use 'setProjectId' method", () => {
            const projectId = "pro-TEST_ID_WITH_16_CHARACTERS";
            dalleClient.setProjectId(projectId);
            expect(dalleClient.organizationIDs['OpenAI-Project']).toBe(projectId);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
                'OpenAI-Project': projectId,
            });
        });
        it("Test use 'getModels' method", async () => {
            const mockResponse = { data: [{ id: 'model1' }, { id: 'model2' }] };
            mockHttpClient.get.mockResolvedValue(mockResponse);
    
            const result = await dalleClient.getModels();
            expect(result).toEqual(mockResponse.data);
            expect(mockHttpClient.get).toHaveBeenCalledWith('/models');
        });
        it("Test use 'getModel' method", async () => {
            const modelId = 'test-model-id';
            const mockResponse = { id: modelId, name: 'Test Model' };
            mockHttpClient.get.mockResolvedValue(mockResponse);
    
            const result = await dalleClient.getModel(modelId);
            expect(result).toEqual(mockResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(`/models/${modelId}`);
        });
        it("Test use 'createImage' method", async () => {
            const prompt = 'test prompt';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/image.png' }] };
            mockHttpClient.post.mockResolvedValue(mockResponse);
    
            const result = await dalleClient.createImage(prompt, modelId, config);
            expect(result).toEqual(mockResponse.data);
            expect(mockHttpClient.post).toHaveBeenCalledWith('/images/generations', {
                ...config,
                prompt,
                model: modelId,
            });
        });
        it("Test use 'createImageEdit' method", async () => {
            const imagePath = '/path/to/image.png';
            const prompt = 'test edit prompt';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/edited-image.png' }] };
            const mockFileStream = 'mock-file-stream';
            
            fs.createReadStream.mockReturnValue(mockFileStream);
            mockHttpClient.post.mockResolvedValue(mockResponse);
            const appendSpy = jest.spyOn(FormData.prototype, 'append');
            const getHeadersSpy = jest.spyOn(FormData.prototype, 'getHeaders').mockReturnValue({ 'content-type': 'multipart/form-data' });
    
            const result = await dalleClient.createImageEdit(imagePath, prompt, modelId, config);
            
            expect(result).toEqual(mockResponse.data);
            expect(fs.createReadStream).toHaveBeenCalledWith(imagePath);
            expect(appendSpy).toHaveBeenCalledWith('image', mockFileStream);
            expect(appendSpy).toHaveBeenCalledWith('prompt', prompt);
            expect(appendSpy).toHaveBeenCalledWith('model', modelId);
            expect(appendSpy).toHaveBeenCalledWith('size', '1024x1024');
            expect(getHeadersSpy).toHaveBeenCalled();
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/images/edits',
                expect.any(FormData),
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );

            appendSpy.mockRestore();
            getHeadersSpy.mockRestore();
        });
        it("Test use 'createImageVariation' method", async () => {
            const imagePath = '/path/to/image.png';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/variation-image.png' }] };
            const mockFileStream = 'mock-file-stream';
            
            fs.createReadStream.mockReturnValue(mockFileStream);
            mockHttpClient.post.mockResolvedValue(mockResponse);
            
            const appendSpy = jest.spyOn(FormData.prototype, 'append');
            const getHeadersSpy = jest.spyOn(FormData.prototype, 'getHeaders').mockReturnValue({ 'content-type': 'multipart/form-data' });
            const result = await dalleClient.createImageVariation(imagePath, modelId, config);
            
            expect(result).toEqual(mockResponse.data);
            expect(fs.createReadStream).toHaveBeenCalledWith(imagePath);
            expect(appendSpy).toHaveBeenCalledWith('image', mockFileStream);
            expect(appendSpy).toHaveBeenCalledWith('model', modelId);
            expect(appendSpy).toHaveBeenCalledWith('size', '1024x1024');
            expect(getHeadersSpy).toHaveBeenCalled();
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/images/variations',
                expect.any(FormData),
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );

            appendSpy.mockRestore();
            getHeadersSpy.mockRestore();
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when organization ID is invalid", () => {
            expect(() => dalleClient.setOrganizationId('')).toThrow(AIConnectifyError);
        });
        it("Test when project ID is invalid", () => {
            expect(() => dalleClient.setProjectId('')).toThrow(AIConnectifyError);
        });
        it("Test when 'getModels' request failure", async () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            await expect(dalleClient.getModels()).rejects.toThrow(AIConnectifyError);
        });
        it("Test when 'getModel' request failure", async () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            await expect(dalleClient.getModel('test-model-id')).rejects.toThrow(AIConnectifyError);
        });
        it("Test when 'createImage' request failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            await expect(dalleClient.createImage('prompt', 'model-id')).rejects.toThrow(AIConnectifyError);
        });
        it("Test when 'createImageEdit' request failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            await expect(dalleClient.createImageEdit('/path', 'prompt', 'model-id')).rejects.toThrow(AIConnectifyError);
        });
        it("Test when 'createImageVariation' request failure", async () => {
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            await expect(dalleClient.createImageVariation('/path', 'model-id')).rejects.toThrow(AIConnectifyError);
        });
    });
});