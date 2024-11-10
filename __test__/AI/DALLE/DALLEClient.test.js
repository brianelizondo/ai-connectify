import DALLEClient from '../../../lib/connectors/AI/DALLE/DALLEClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';
import HttpClient from '../../../lib/connectors/HttpClient/HttpClient';
import FormData from 'form-data';
import fs from 'fs';

jest.mock('../../../lib/connectors/HttpClient/HttpClient');
jest.mock('form-data');

describe("DALLEClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.openai.com/v1";
    let dalleClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            throwError: jest.fn()
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

            const mockFormData = {
                append: jest.fn(),
                getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
            };
            FormData.mockImplementation(() => mockFormData);

            const mockResponse = { data: [{ url: 'http://example.com/edited-image.png' }] };
            dalleClient.httpRequest.post.mockResolvedValue(mockResponse);

            const result = await dalleClient.createImageEdit(imagePath, prompt, modelId, config);
            expect(dalleClient.httpRequest.post).toHaveBeenCalledWith(
                '/images/edits',
                expect.objectContaining({
                    append: mockFormData['append']
                }), 
                expect.objectContaining({
                    headers: { 'content-type': 'multipart/form-data' }
                })
            );
        });
        it("Test use 'createImageVariation' method", async () => {
            const imagePath = '/path/to/image.png';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };

            const mockFormData = {
                append: jest.fn(),
                getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
            };
            FormData.mockImplementation(() => mockFormData);

            const mockResponse = { data: [{ url: 'http://example.com/edited-image.png' }] };
            dalleClient.httpRequest.post.mockResolvedValue(mockResponse);

            const result = await dalleClient.createImageVariation(imagePath, modelId, config);
            expect(dalleClient.httpRequest.post).toHaveBeenCalledWith(
                '/images/variations',
                expect.objectContaining({
                    append: mockFormData['append']
                }), 
                expect.objectContaining({
                    headers: { 'content-type': 'multipart/form-data' }
                })
            );
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
        });
        it("Test when organization ID is invalid", () => {
            expect(() => dalleClient.setOrganizationId('')).toThrow(AIConnectifyError);
        });
        it("Test when project ID is invalid", () => {
            expect(() => dalleClient.setProjectId('')).toThrow(AIConnectifyError);
        });
        it("Test when 'getModel' request failure", async () => {
            await expect(dalleClient.getModel()).rejects.toThrow(AIConnectifyError);
            await expect(dalleClient.getModel()).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createImage' request failure", async () => {
            await expect(dalleClient.createImage()).rejects.toThrow(AIConnectifyError);
            await expect(dalleClient.createImage(12345)).rejects.toThrow('Cannot process the prompt');
            await expect(dalleClient.createImage('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createImageEdit' request failure", async () => {
            await expect(dalleClient.createImageEdit()).rejects.toThrow(AIConnectifyError);
            await expect(dalleClient.createImageEdit(12345)).rejects.toThrow('Cannot process the image path');
            await expect(dalleClient.createImageEdit('test', 12345)).rejects.toThrow('Cannot process the prompt');
            await expect(dalleClient.createImageEdit('test', 'test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createImageVariation' request failure", async () => {
            await expect(dalleClient.createImageVariation()).rejects.toThrow(AIConnectifyError);
            await expect(dalleClient.createImageVariation(12345)).rejects.toThrow('Cannot process the image path');
            await expect(dalleClient.createImageVariation('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
    });
});