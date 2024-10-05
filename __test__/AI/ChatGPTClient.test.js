import fs from 'fs';
import FormData from 'form-data';
import ChatGPTClient from '../../lib/connectors/AI/ChatGPT/ChatGPTClient';
import HttpClient from '../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../lib/AIConnectifyError';

jest.mock('../../lib/connectors/HttpClient/HttpClient');
jest.mock('fs');
jest.mock('form-data');

describe("ChatGPTClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.openai.com/v1";
    let chatGPTClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn()
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        chatGPTClient = new ChatGPTClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(chatGPTClient).toBeInstanceOf(ChatGPTClient);
            expect(chatGPTClient.aiName).toBe('ChatGPT');
            expect(chatGPTClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
            });
        });
    });

    describe("Use each method individually", () => {
        describe("Organization and Project ID Methods", () => {
            it("Test call 'setOrganizationId' method", () => {
                const orgId = "org-TEST_ID_WITH_16_CHARACTERS";
                chatGPTClient.setOrganizationId(orgId);
                expect(HttpClient).toHaveBeenCalledTimes(2);
                expect(chatGPTClient.organizationIDs['OpenAI-Organization']).toBe(orgId);
            });
            it("Test call 'setProjectId' method", () => {
                const projectId = "pro-TEST_ID_WITH_16_CHARACTERS";
                chatGPTClient.setProjectId(projectId);
                expect(HttpClient).toHaveBeenCalledTimes(2);
                expect(chatGPTClient.organizationIDs['OpenAI-Project']).toBe(projectId);
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' method", async () => {
                const mockResponse = { data: [{ id: 'model1' }, { id: 'model2' }] };
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getModels();
                expect(result).toEqual(mockResponse.data);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith('/models');
            });
            it("Test call 'getModel' method with the correct modelID", async () => {
                const modelId = 'test-model';
                const mockResponse = { id: modelId, owner: 'openai' };
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith(`/models/${modelId}`);
            });
        });

        describe("Chat Methods", () => {
            it("Test call 'createChatCompletion' method", async () => {
                const messages = [{ role: 'user', content: 'Hello' }];
                const modelId = 'gpt-3.5-turbo';
                const config = { temperature: 0.7 };
                const mockResponse = { 
                    choices: [{ message: { content: 'Hi!' } }],
                    usage: { total_tokens: 10 }
                };
                
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await chatGPTClient.createChatCompletion(messages, modelId, config);
                expect(result).toEqual({
                    choices: [{ message: { content: 'Hi!' } }]
                });
                expect(chatGPTClient.httpRequest.post).toHaveBeenCalledWith(
                    '/chat/completations',
                    expect.objectContaining({
                        messages,
                        model: modelId,
                        temperature: 0.7
                    })
                );
            });
        });

        describe('Embeddings Methods', () => {
            it("Test call 'createEmbeddings' method", async () => {
                const input = 'test text';
                const modelId = 'text-embedding-ada-002';
                const config = {};
                const mockResponse = { data: [{ embedding: [0.1, 0.2, 0.3] }] };
                
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.createEmbeddings(input, modelId, config);
                expect(result).toEqual(mockResponse.data);
                expect(chatGPTClient.httpRequest.post).toHaveBeenCalledWith(
                    '/embeddings',
                    expect.objectContaining({
                        input,
                        model: modelId
                    })
                );
            });
        });

        describe('Moderations Methods', () => {
            it("Test call 'createModeration' method", async () => {
                const input = 'test text';
                const modelId = 'text-moderation-latest';
                const mockResponse = { results: [{ flagged: false }] };
                
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.createModeration(input, modelId);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.post).toHaveBeenCalledWith(
                    '/moderations',
                    expect.objectContaining({
                        input,
                        model: modelId
                    })
                );
            });
        });

        describe('Audio Methods', () => {
            it("Test call 'createSpeech' method", async () => {
                const input = 'test text';
                const destFolder = '/test/folder';
                const modelId = 'tts-1';
                const responseFormat = 'mp3';
                const voice = 'alloy';
                const config = {};
    
                const mockFormData = {
                    append: jest.fn(),
                    getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
                };
                FormData.mockImplementation(() => mockFormData);
    
                const mockResponse = Buffer.from('audio data');
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                fs.writeFileSync.mockImplementation(() => {});
    
                const result = await chatGPTClient.createSpeech(input, destFolder, modelId, responseFormat, voice, config);
                expect(result).toHaveProperty('audio_path');
                expect(mockFormData.append).toHaveBeenCalledWith('input', input);
                expect(mockFormData.append).toHaveBeenCalledWith('model', modelId);
            });
    
            it("Test call 'createTranscription' method", async () => {
                const filePath = '/test/audio.mp3';
                const modelId = 'whisper-1';
                const config = {};
                const mockResponse = { text: 'Transcribed text' };
    
                const mockFormData = {
                    append: jest.fn(),
                    getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
                };
                FormData.mockImplementation(() => mockFormData);
    
                fs.createReadStream.mockReturnValue('file stream');
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.createTranscription(filePath, modelId, config);
                expect(result).toBe(mockResponse.text);
                expect(mockFormData.append).toHaveBeenCalledWith('file', 'file stream');
                expect(mockFormData.append).toHaveBeenCalledWith('model', modelId);
            });
    
            it("Test call 'createTranslation' method", async () => {
                const filePath = '/test/audio.mp3';
                const modelId = 'whisper-1';
                const config = {};
                const mockResponse = { text: 'Translated text' };
    
                const mockFormData = {
                    append: jest.fn(),
                    getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
                };
                FormData.mockImplementation(() => mockFormData);
    
                fs.createReadStream.mockReturnValue('file stream');
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.createTranslation(filePath, modelId, config);
                expect(result).toBe(mockResponse.text);
                expect(mockFormData.append).toHaveBeenCalledWith('file', 'file stream');
                expect(mockFormData.append).toHaveBeenCalledWith('model', modelId);
            });
        });

        describe('Fine-tuning Methods', () => {
            it("Test call 'getFineTuningJob' method", async () => {
                const jobId = 'ft-job-123-16-characters';
                const mockResponse = { id: jobId, status: 'succeeded' };
                
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getFineTuningJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${jobId}`);
            });
    
            it("Test call 'getFineTuningJobs' method", async () => {
                const config = { limit: 10 };
                const mockResponse = { data: [{ id: 'job1' }, { id: 'job2' }] };
                
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getFineTuningJobs(config);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith('/fine_tuning/jobs', config);
            });
    
            it("Test call 'getFineTuningEvents' method", async () => {
                const jobId = 'ft-job-123-16-characters';
                const config = { limit: 10 };
                const mockResponse = { data: [{ type: 'metrics' }] };
                
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getFineTuningEvents(jobId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${jobId}/events`, config);
            });
    
            it("Test call 'getFineTuningCheckpoints' method", async () => {
                const jobId = 'ft-job-123-16-characters';
                const config = { limit: 10 };
                const mockResponse = { data: [{ checkpoint: 1 }] };
                
                chatGPTClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.getFineTuningCheckpoints(jobId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${jobId}/checkpoints`, config);
            });
    
            it("Test call 'createFineTuning' method", async () => {
                const fileId = 'file-123';
                const modelId = 'gpt-3.5-turbo';
                const config = { hyperparameters: { epochs: 3 } };
                const mockResponse = { id: 'ft-job-123', status: 'created' };
                
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.createFineTuning(fileId, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.post).toHaveBeenCalledWith(
                    '/fine_tuning/jobs',
                    expect.objectContaining({
                        training_file: fileId,
                        model: modelId,
                        hyperparameters: { epochs: 3 }
                    })
                );
            });
    
            it("Test call 'cancelFineTuning' method", async () => {
                const jobId = 'ft-job-123-16-characters';
                const mockResponse = { id: jobId, status: 'cancelled' };
                
                chatGPTClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.cancelFineTuning(jobId);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.post).toHaveBeenCalledWith(`/fine_tuning/jobs/${jobId}/cancel`);
            });

            it("Test call 'delFineTunedModel' method", async () => {
                const modelId = 'test-model';
                const mockResponse = { deleted: true };
                chatGPTClient.httpRequest.delete.mockResolvedValue(mockResponse);
    
                const result = await chatGPTClient.delFineTunedModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(chatGPTClient.httpRequest.delete).toHaveBeenCalledWith(`/models/${modelId}`);
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            mockHttpClient.delete.mockRejectedValue(new Error('API Error'));
        });
        it("Test when organization ID is invalid", () => {
            expect(() => chatGPTClient.setOrganizationId('')).toThrow(AIConnectifyError);
        });
        it("Test when project ID is invalid", () => {
            expect(() => chatGPTClient.setProjectId('')).toThrow(AIConnectifyError);
        });
        it("Test when 'getModel' request failure", async () => {
            await expect(chatGPTClient.getModel()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.getModel(12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'delFineTunedModel' request failure", async () => {
            await expect(chatGPTClient.delFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.delFineTunedModel(12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createChatCompletion' request failure", async () => {
            await expect(chatGPTClient.createChatCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createChatCompletion(123456)).rejects.toThrow('This is not an array');
            await expect(chatGPTClient.createChatCompletion([1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createEmbeddings' request failure", async () => {
            await expect(chatGPTClient.createEmbeddings()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createEmbeddings(12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createModeration' request failure", async () => {
            await expect(chatGPTClient.createModeration()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createModeration(12345)).rejects.toThrow('Cannot process the input text');
            await expect(chatGPTClient.createModeration('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createSpeech' request failure", async () => {
            await expect(chatGPTClient.createSpeech()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createSpeech(12345)).rejects.toThrow('Cannot process the input text');
            await expect(chatGPTClient.createSpeech('test', 12345)).rejects.toThrow('Cannot process the destination folder');
            await expect(chatGPTClient.createSpeech('test', 'test', 12345)).rejects.toThrow('Cannot process the model ID');
            await expect(chatGPTClient.createSpeech('test', 'test', 'test',12345)).rejects.toThrow('Cannot process the response format');
        });
        it("Test when 'createTranscription' request failure", async () => {
            await expect(chatGPTClient.createTranscription()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createTranscription(12345)).rejects.toThrow('Cannot process the file path');
            await expect(chatGPTClient.createTranscription('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'createTranslation' request failure", async () => {
            await expect(chatGPTClient.createTranslation()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createTranslation(12345)).rejects.toThrow('Cannot process the file path');
            await expect(chatGPTClient.createTranslation('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getFineTuningJob' request failure", async () => {
            await expect(chatGPTClient.getFineTuningJob()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.getFineTuningJob(12345)).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it("Test when 'getFineTuningEvents' request failure", async () => {
            await expect(chatGPTClient.getFineTuningEvents()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.getFineTuningEvents(12345)).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it("Test when 'getFineTuningCheckpoints' request failure", async () => {
            await expect(chatGPTClient.getFineTuningCheckpoints()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.getFineTuningCheckpoints(12345)).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
        it("Test when 'createFineTuning' request failure", async () => {
            await expect(chatGPTClient.createFineTuning()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.createFineTuning(12345)).rejects.toThrow('Cannot process the training file ID');
            await expect(chatGPTClient.createFineTuning('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'cancelFineTuning' request failure", async () => {
            await expect(chatGPTClient.cancelFineTuning()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPTClient.cancelFineTuning(12345)).rejects.toThrow('Cannot process the fine-tuning job ID');
        });
    });
});