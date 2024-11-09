import AIConnectifyError from '../../lib/AIConnectifyError';
import ChatGPT from '../../lib/connectors/AI/ChatGPT/ChatGPT';
import ChatGPTClient from '../../lib/connectors/AI/ChatGPT/ChatGPTClient';

jest.mock('../../lib/connectors/AI/ChatGPT/ChatGPTClient');

describe("ChatGPT class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let chatGPT;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setOrganizationId: jest.fn(),
            setProjectId: jest.fn(),
            cancelFineTuningJob: jest.fn(),
            createChatCompletion: jest.fn(),
            createEmbeddings: jest.fn(),
            createFineTuningJob: jest.fn(),
            createModeration: jest.fn(),
            createSpeech: jest.fn(),
            createTranscription: jest.fn(),
            createTranslation: jest.fn(),
            deleteFineTunedModel: jest.fn(),
            getFineTuningJob: jest.fn(),
            getFineTuningJobCheckpoints: jest.fn(),
            getFineTuningJobEvents: jest.fn(),
            getFineTuningJobs: jest.fn(),
            getModel: jest.fn(),
            getModels: jest.fn()
        };
        ChatGPTClient.mockImplementation(() => mockClientInstance);
        chatGPT = new ChatGPT(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(chatGPT).toBeInstanceOf(ChatGPT);
            expect(ChatGPTClient).toHaveBeenCalledWith(mockApiKey);
        });
    });
    
    describe("Use each method individually", () => {
        describe("Organization and Project ID Methods", () => {
            it("Test call 'setOrganizationId' on the client instance", () => {
                const orgId = 'test-org-id';
                chatGPT.setOrganizationId(orgId);
                expect(mockClientInstance.setOrganizationId).toHaveBeenCalledWith(orgId);
            });
            it("Test call 'setProjectId' on the client instance", () => {
                const projectId = 'test-project-id';
                chatGPT.setProjectId(projectId);
                expect(mockClientInstance.setProjectId).toHaveBeenCalledWith(projectId);
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' on the client instance", async () => {
                const mockModels = [{ id: 'model1' }, { id: 'model2' }];
                mockClientInstance.getModels.mockResolvedValue(mockModels);
                
                const result = await chatGPT.getModels();
                expect(result).toEqual(mockModels);
                expect(mockClientInstance.getModels).toHaveBeenCalled();
            });
            it("Test call 'getModel' on the client instance with the correct modelID", async () => {
                const modelId = 'test-model-id';
                const mockModel = { id: modelId, name: 'Test Model' };
                mockClientInstance.getModel.mockResolvedValue(mockModel);
                
                const result = await chatGPT.getModel(modelId);
                expect(result).toEqual(mockModel);
                expect(mockClientInstance.getModel).toHaveBeenCalledWith(modelId);
            });
        });

        describe("Chat Methods", () => {
            it("Test call 'createChatCompletion' on the client instance", async () => {
                const messages = [{ role: 'user', content: 'Hello' }];
                const modelId = 'gpt-3.5-turbo';
                const config = { temperature: 0.7 };
                const mockResponse = { choices: [{ message: { content: 'Hi!' } }] };
                
                chatGPT.client.createChatCompletion.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createChatCompletion(messages, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createChatCompletion).toHaveBeenCalledWith(messages, modelId, config);
            });
        });

        describe("Embeddings Methods", () => {
            it("Test call 'createEmbeddings' on the client instance", async () => {
                const input = 'test text';
                const modelId = 'text-embedding-ada-002';
                const config = {};
                const mockResponse = { embeddings: [[0.1, 0.2, 0.3]] };
                
                chatGPT.client.createEmbeddings.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createEmbeddings(input, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createEmbeddings).toHaveBeenCalledWith(input, modelId, config);
            });
        });

        describe("Moderation Methods", () => {
            it("Test call 'createModeration' on the client instance", async () => {
                const input = 'test text';
                const modelId = 'text-moderation-latest';
                const mockResponse = { results: [{ flagged: false }] };
                
                chatGPT.client.createModeration.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createModeration(input, modelId);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createModeration).toHaveBeenCalledWith(input, modelId);
            });
        });

        describe("Audio Methods", () => {
            it("Test call 'createSpeech' on the client instance", async () => {
                const input = 'test text';
                const destFolder = '/test/folder';
                const modelId = 'tts-1';
                const responseFormat = 'mp3';
                const voice = 'alloy';
                const config = {};
                const mockResponse = { audio_path: '/test/folder/audio.mp3' };
                
                chatGPT.client.createSpeech.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createSpeech(input, destFolder, modelId, responseFormat, voice, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createSpeech).toHaveBeenCalledWith(
                    input, destFolder, modelId, responseFormat, voice, config
                );
            });
            it("Test call 'createTranscription' on the client instance", async () => {
                const filePath = '/test/audio.mp3';
                const modelId = 'whisper-1';
                const config = {};
                const mockResponse = 'Transcribed text';
                
                chatGPT.client.createTranscription.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createTranscription(filePath, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createTranscription).toHaveBeenCalledWith(filePath, modelId, config);
            });
    
            it("Test call 'createTranslation' on the client instance", async () => {
                const filePath = '/test/audio.mp3';
                const modelId = 'whisper-1';
                const config = {};
                const mockResponse = 'Translated text';
                
                chatGPT.client.createTranslation.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createTranslation(filePath, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createTranslation).toHaveBeenCalledWith(filePath, modelId, config);
            });
        });
        
        describe("Fine-tuning Jobs Methods", () => {
            it("Test call 'getFineTuningJob' on the client instance", async () => {
                const jobId = 'ft-job-123';
                const mockResponse = { id: jobId, status: 'succeeded' };
                
                chatGPT.client.getFineTuningJob.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.getFineTuningJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.getFineTuningJob).toHaveBeenCalledWith(jobId);
            });
    
            it("Test call 'getFineTuningJobs' on the client instance", async () => {
                const config = { limit: 10 };
                const mockResponse = { data: [{ id: 'job1' }, { id: 'job2' }] };
                
                chatGPT.client.getFineTuningJobs.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.getFineTuningJobs(config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.getFineTuningJobs).toHaveBeenCalledWith(config);
            });
    
            it("Test call 'getFineTuningJobEvents' on the client instance", async () => {
                const jobId = 'ft-job-123';
                const config = { limit: 10 };
                const mockResponse = { data: [{ type: 'metrics' }] };
                
                chatGPT.client.getFineTuningJobEvents.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.getFineTuningJobEvents(jobId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.getFineTuningJobEvents).toHaveBeenCalledWith(jobId, config);
            });
    
            it("Test call 'createFineTuningJob' on the client instance", async () => {
                const fileId = 'file-123';
                const modelId = 'gpt-3.5-turbo';
                const config = { hyperparameters: { epochs: 3 } };
                const mockResponse = { id: 'ft-job-123', status: 'created' };
                
                chatGPT.client.createFineTuningJob.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.createFineTuningJob(fileId, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.createFineTuningJob).toHaveBeenCalledWith(fileId, modelId, config);
            });
    
            it("Test call 'cancelFineTuningJob' on the client instance", async () => {
                const jobId = 'ft-job-123';
                const mockResponse = { id: jobId, status: 'cancelled' };
                
                chatGPT.client.cancelFineTuningJob.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.cancelFineTuningJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.cancelFineTuningJob).toHaveBeenCalledWith(jobId);
            });
            it("Test call 'deleteFineTunedModel' on the client instance", async () => {
                const modelId = 'test-model';
                const mockResponse = { deleted: true };
                chatGPT.client.deleteFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await chatGPT.deleteFineTunedModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(chatGPT.client.deleteFineTunedModel).toHaveBeenCalledWith(modelId);
            });
        });
    });
    
    
    describe("Throw the AIConnectifyError error", () => {
         it("Tests when API key is not provided", () => {
            expect(() => new ChatGPT()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new ChatGPT('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });
});