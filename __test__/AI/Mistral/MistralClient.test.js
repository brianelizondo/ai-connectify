import MistralClient from '../../../lib/connectors/AI/Mistral/MistralClient'
import HttpClient from '../../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';

jest.mock('../../../lib/connectors/HttpClient/HttpClient');

describe("MistralClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockTestUrl = "https://api.mistral.ai/v1";
    let mistralClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            throwError: jest.fn()
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        mistralClient = new MistralClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(mistralClient).toBeInstanceOf(MistralClient);
            expect(mistralClient.aiName).toBe('Mistral');
            expect(mistralClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `Bearer ${mockApiKey}`,
            });
        });
    });

    describe("Use each method individually", () => {
        describe("Models Methods", () => {
            it("Test call 'getModel' method", async () => {
                const modelId = 'test-model';
                const mockResponse = { 
                    model: modelId,
                    owned_by: "mistralai",
                    created: 0,
                    description: "model description"
                };
                mistralClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await mistralClient.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.get).toHaveBeenCalledWith(`/models/${modelId}`);
            });
            it("Test call 'getModels' method", async () => {
                const mockResponse = {
                    data: [{ 
                        id: "id-test-response",
                        owned_by: "mistralai",
                        created: 0,
                        description: "model description"
                    }]
                };
                mistralClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await mistralClient.getModels();
                expect(result).toEqual(mockResponse.data);
                expect(mistralClient.httpRequest.get).toHaveBeenCalledWith('/models');
            });
        });

        describe("Chat Methods", () => {
            it("Test call 'createChatCompletion' method", async () => {
                const messagesArray = [{ 
                    role: "user",
                    content: "Who is the best French painter? Answer in one short sentence."
                 }];
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    object: "chat.completion",
                    model: modelId
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.createChatCompletion(messagesArray, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(
                    '/chat/completions',
                    expect.objectContaining({
                        ...config, 
                        messages: messagesArray, 
                        model: modelId
                    })
                );
            });
        });

        describe("FIM Methods", () => {
            it("Test call 'fimCompletion' method", async () => {
                const prompt = "prompt for testing";
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    object: "chat.completion",
                    model: modelId
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.fimCompletion(prompt, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(
                    '/fim/completions',
                    expect.objectContaining({
                        ...config, 
                        prompt: prompt, 
                        model: modelId
                    })
                );
            });
        });

        describe("Agents Methods", () => {
            it("Test call 'agentsCompletion' method", async () => {
                const messagesArray = [{
                    "role": "user",
                    "content": "Who is the best French painter? Answer in one short sentence."
                }];
                const agentID = 'agent-test-id';
                const config = { max_tokens: 0 };
                const mockResponse = { 
                    choices: [{ message: { content: 'Hi!' } }]
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.agentsCompletion(messagesArray, agentID, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(
                    '/agents/completions', 
                    expect.objectContaining({
                        ...config, 
                        messages: messagesArray, 
                        agent_id: agentID
                    })
                );
            });
        });

        describe("Embeddings Methods", () => {
            it("Test call 'embeddings' method", async () => {
                const input = [
                    "Embed this sentence.",
                    "As well as this one."
                ];
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    object: "chat.completion",
                    model: modelId
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.embeddings(input, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(
                    '/embeddings', 
                    expect.objectContaining({
                        ...config, 
                        input: input, 
                        model: modelId
                    })
                );
            });
        });

        describe("Fine-Tuning Jobs Methods", () => {
            it("Test call 'getFineTuningJob' method", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = { 
                    id: "id-test-response",
                    auto_start: true,
                    model: "model-test-id",
                    status: "QUEUED"
                };
                mistralClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await mistralClient.getFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.get).toHaveBeenCalledWith(`/fine_tuning/jobs/${fine_tuning_job_id}`);
            });
            it("Test call 'getFineTuningJobs' method", async () => {
                const config = { page: 1 };
                const mockResponse = {
                    data: [{ 
                        id: "id-test-response",
                        auto_start: true,
                        model: "model-test-id",
                        status: "QUEUED"
                    }]
                };
                mistralClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await mistralClient.getFineTuningJobs(config);
                expect(result).toEqual(mockResponse.data);
                expect(mistralClient.httpRequest.get).toHaveBeenCalledWith(
                    '/fine_tuning/jobs',
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'createFineTuningJob' method", async () => {
                const hyperparameters = {
                    training_steps: 1,
                    learning_rate: 0.0001,
                    weight_decay: 0.1,
                    warmup_fraction: 0.05,
                    epochs: 0,
                    fim_ratio: 0.9,
                    seq_len: 100
                };
                const modelId = 'model-test-id';
                const config = { auto_start: true };
                const mockResponse = {
                    id: "id-test-response",
                    object: "chat.completion",
                    model: modelId
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.createFineTuningJob(hyperparameters, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(
                    '/fine_tuning/jobs',
                    expect.objectContaining({
                        ...config, 
                        hyperparameters: hyperparameters, 
                        model: modelId
                    })
                );
            });
            it("Test call 'startFineTuningJob' method", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = {
                    id: fine_tuning_job_id,
                    object: "model",
                    auto_start: true,
                    status: "QUEUED"
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.startFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(`/fine_tuning/jobs/${fine_tuning_job_id}/start`);
            });
            it("Test call 'cancelFineTuningJob' method", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = {
                    id: fine_tuning_job_id,
                    object: "model",
                    auto_start: true,
                    status: "QUEUED"
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.cancelFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(`/fine_tuning/jobs/${fine_tuning_job_id}/cancel`);
            });
        });

        describe("Fine-Tuning Models Methods", () => {
            it("Test call 'updateFineTuningModel' method", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const config = {
                    name: "updated name",
                    description: "updated description"
                }
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    archived: true,
                    name: config.name,
                    description: config.description,
                };
                
                mistralClient.httpRequest.patch.mockResolvedValue(mockResponse);

                const result = await mistralClient.updateFineTuningModel(fine_tuning_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.patch).toHaveBeenCalledWith(
                    `/fine_tuning/models/${fine_tuning_model_id}`, 
                    expect.objectContaining({
                        ...config
                    })
                );
            });
            it("Test call 'archiveFineTuningModel' method", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    archived: false
                };
                
                mistralClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await mistralClient.archiveFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.post).toHaveBeenCalledWith(`/fine_tuning/models/${fine_tuning_model_id}/archive`);
            });
            it("Test call 'unarchiveFineTuningModel' method", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    archived: false
                };
                
                mistralClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await mistralClient.unarchiveFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.delete).toHaveBeenCalledWith(`/fine_tuning/models/${fine_tuning_model_id}/archive`);
            });
            it("Test call 'deleteFineTuningModel' method", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    deleted: true
                };
                
                mistralClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await mistralClient.deleteFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mistralClient.httpRequest.delete).toHaveBeenCalledWith(`/models/${fine_tuning_model_id}`);
            });
        });

    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            mockHttpClient.patch.mockRejectedValue(new Error('API Error'));
            mockHttpClient.delete.mockRejectedValue(new Error('API Error'));
        });
        
        it("Test when 'agentsCompletion' request failure", async () => {
            await expect(mistralClient.agentsCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.agentsCompletion([])).rejects.toThrow('Cannot process the message array');
            await expect(mistralClient.agentsCompletion(123456)).rejects.toThrow('This is not an array');
            
            await expect(mistralClient.agentsCompletion([1,2,3])).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.agentsCompletion([1,2,3], '')).rejects.toThrow('Cannot process the agent ID');
            await expect(mistralClient.agentsCompletion([1,2,3], 12345)).rejects.toThrow('Cannot process the agent ID');
        });
        
        it("Test when 'archiveFineTuningModel' request failure", async () => {
            await expect(mistralClient.archiveFineTuningModel()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.archiveFineTuningModel('')).rejects.toThrow('Cannot process the fine tunning model ID');
            await expect(mistralClient.archiveFineTuningModel(12345)).rejects.toThrow('Cannot process the fine tunning model ID');
        });

        it("Test when 'cancelFineTuningJob' request failure", async () => {
            await expect(mistralClient.cancelFineTuningJob()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.cancelFineTuningJob('')).rejects.toThrow('Cannot process the fine tunning job ID');
            await expect(mistralClient.cancelFineTuningJob(12345)).rejects.toThrow('Cannot process the fine tunning job ID');
        });   
        
        it("Test when 'createChatCompletion' request failure", async () => {
            await expect(mistralClient.createChatCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.createChatCompletion([])).rejects.toThrow('Cannot process the messages array');
            await expect(mistralClient.createChatCompletion(123456)).rejects.toThrow('This is not an array');
            
            await expect(mistralClient.createChatCompletion([1,2,3])).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.createChatCompletion([1,2,3], '')).rejects.toThrow('Cannot process the model ID');
            await expect(mistralClient.createChatCompletion([1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        
        it("Test when 'createFineTuningJob' request failure", async () => {
            await expect(mistralClient.createFineTuningJob()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.createFineTuningJob('')).rejects.toThrow('Cannot process the model ID');
            await expect(mistralClient.createFineTuningJob(12345)).rejects.toThrow('Cannot process the model ID');
        });

        it("Test when 'deleteFineTuningModel' request failure", async () => {
            await expect(mistralClient.deleteFineTuningModel()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.deleteFineTuningModel('')).rejects.toThrow('Cannot process the fine tunning model ID');
            await expect(mistralClient.deleteFineTuningModel(12345)).rejects.toThrow('Cannot process the fine tunning model ID');
        });

        it("Test when 'embeddings' request failure", async () => {
            await expect(mistralClient.embeddings()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.embeddings('')).rejects.toThrow('Cannot process the model ID');
            await expect(mistralClient.embeddings(12345)).rejects.toThrow('Cannot process the model ID');
        });

        it("Test when 'fimCompletion' request failure", async () => {
            await expect(mistralClient.fimCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.fimCompletion([])).rejects.toThrow('Cannot process the prompt');
            await expect(mistralClient.fimCompletion(123456)).rejects.toThrow('Cannot process the prompt');
            
            await expect(mistralClient.fimCompletion('promt')).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.fimCompletion('promt', '')).rejects.toThrow('Cannot process the model ID');
            await expect(mistralClient.fimCompletion('promt', 12345)).rejects.toThrow('Cannot process the model ID');
        });

        it("Test when 'getFineTuningJob' request failure", async () => {
            await expect(mistralClient.getFineTuningJob()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.getFineTuningJob('')).rejects.toThrow('Cannot process the fine tunning job ID');
            await expect(mistralClient.getFineTuningJob(12345)).rejects.toThrow('Cannot process the fine tunning job ID');
        }); 

        it("Test when 'getModel' request failure", async () => {
            await expect(mistralClient.getModel()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.getModel('')).rejects.toThrow('Cannot process the model ID');
            await expect(mistralClient.getModel(12345)).rejects.toThrow('Cannot process the model ID');
        });

        it("Test when 'startFineTuningJob' request failure", async () => {
            await expect(mistralClient.startFineTuningJob()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.startFineTuningJob('')).rejects.toThrow('Cannot process the fine tunning job ID');
            await expect(mistralClient.startFineTuningJob(12345)).rejects.toThrow('Cannot process the fine tunning job ID');
        }); 

        it("Test when 'unarchiveFineTuningModel' request failure", async () => {
            await expect(mistralClient.unarchiveFineTuningModel()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.unarchiveFineTuningModel('')).rejects.toThrow('Cannot process the fine tunning model ID');
            await expect(mistralClient.unarchiveFineTuningModel(12345)).rejects.toThrow('Cannot process the fine tunning model ID');
        });

        it("Test when 'updateFineTuningModel' request failure", async () => {
            await expect(mistralClient.updateFineTuningModel()).rejects.toThrow(AIConnectifyError);
            await expect(mistralClient.updateFineTuningModel('')).rejects.toThrow('Cannot process the fine tunning model ID');
            await expect(mistralClient.updateFineTuningModel(12345)).rejects.toThrow('Cannot process the fine tunning model ID');
        });
    });
});