import AIConnectifyError from '../../../lib/AIConnectifyError';
import Mistral from '../../../lib/connectors/AI/Mistral/Mistral';
import MistralClient from '../../../lib/connectors/AI/Mistral/MistralClient';

jest.mock('../../../lib/connectors/AI/Mistral/MistralClient');

describe("Mistral class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let mistral;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            agentsCompletion: jest.fn(),
            archiveFineTuningModel: jest.fn(),
            cancelFineTuningJob: jest.fn(),
            createFineTuningJob: jest.fn(),
            createChatCompletion: jest.fn(),
            deleteFineTuningModel: jest.fn(),
            embeddings: jest.fn(),
            fimCompletion: jest.fn(),
            getFineTuningJob: jest.fn(),
            getFineTuningJobs: jest.fn(),
            getModel: jest.fn(),
            getModels: jest.fn(),
            startFineTuningJob: jest.fn(),
            unarchiveFineTuningModel: jest.fn(),            
            updateFineTuningModel: jest.fn()
        };
        MistralClient.mockImplementation(() => mockClientInstance);
        mistral = new Mistral(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(mistral).toBeInstanceOf(Mistral);
            expect(MistralClient).toHaveBeenCalledWith(mockApiKey);
        });
    });
    
    describe("Use each method individually", () => {
        describe("Models Methods", () => {
            it("Test call 'getModel' on the client instance", async () => {
                const modelId = 'test-model-id';
                const mockResponse = { 
                    model: modelId,
                    owned_by: "mistralai",
                    created: 0,
                    description: "model description"
                };
                mockClientInstance.getModel.mockResolvedValue(mockResponse);
                
                const result = await mistral.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModel).toHaveBeenCalledWith(modelId);
            });
            it("Test call 'getModels' on the client instance", async () => {
                const mockResponse = {
                    data: [{ 
                        id: "id-test-response",
                        owned_by: "mistralai",
                        created: 0,
                        description: "model description"
                    }]
                };
                mockClientInstance.getModels.mockResolvedValue(mockResponse);
                
                const result = await mistral.getModels();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModels).toHaveBeenCalled();
            });
        });

        describe("Chat Methods", () => {
            it("Test call 'createChatCompletion' on the client instance", async () => {
                const messages = [{ role: 'user', content: 'Hello' }];
                const modelId = 'gpt-3.5-turbo';
                const config = { temperature: 0.7 };
                const mockResponse = { choices: [{ message: { content: 'Hi!' } }] };
                
                mistral.client.createChatCompletion.mockResolvedValue(mockResponse);
    
                const result = await mistral.createChatCompletion(messages, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistral.client.createChatCompletion).toHaveBeenCalledWith(messages, modelId, config);
            });
        });

        describe("FIM Methods", () => {
            it("Test call 'fimCompletion' on the client instance", async () => {
                const prompt = "prompt for testing";
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    object: "chat.completion",
                    model: modelId
                };
                
                mistral.client.fimCompletion.mockResolvedValue(mockResponse);
    
                const result = await mistral.fimCompletion(prompt, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistral.client.fimCompletion).toHaveBeenCalledWith(prompt, modelId, config);
            });
        });
        
        describe("Agents Methods", () => {
            it("Test call 'agentsCompletion' on the client instance", async () => {
                const messagesArray = [{
                    "role": "user",
                    "content": "Who is the best French painter? Answer in one short sentence."
                }];
                const agentID = 'agent-test-id';
                const config = { max_tokens: 0 };
                const mockResponse = { 
                    choices: [{ message: { content: 'Hi!' } }]
                };
                
                mistral.client.agentsCompletion.mockResolvedValue(mockResponse);
    
                const result = await mistral.agentsCompletion(messagesArray, agentID, config);
                expect(result).toEqual(mockResponse);
                expect(mistral.client.agentsCompletion).toHaveBeenCalledWith(messagesArray, agentID, config);
            });
        });
        
        describe("Embeddings Methods", () => {
            it("Test call 'embeddings' on the client instance", async () => {
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
                
                mistral.client.embeddings.mockResolvedValue(mockResponse);
    
                const result = await mistral.embeddings(input, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistral.client.embeddings).toHaveBeenCalledWith(input, modelId, config);
            });
        });
        
        describe("Fine-Tuning Jobs Methods", () => {
            it("Test call 'getFineTuningJob' on the client instance", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = { 
                    id: "id-test-response",
                    auto_start: true,
                    model: "model-test-id",
                    status: "QUEUED"
                };
                mockClientInstance.getFineTuningJob.mockResolvedValue(mockResponse);
                
                const result = await mistral.getFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTuningJob).toHaveBeenCalledWith(fine_tuning_job_id);
            });
            it("Test call 'getFineTuningJobs' on the client instance", async () => {
                const config = { page: 1 };
                const mockResponse = [{ id: 'model1' }, { id: 'model2' }];
                mockClientInstance.getFineTuningJobs.mockResolvedValue(mockResponse);
                
                const result = await mistral.getFineTuningJobs(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTuningJobs).toHaveBeenCalled();
            });
            it("Test call 'createFineTuningJob' on the client instance", async () => {
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
                
                mistral.client.createFineTuningJob.mockResolvedValue(mockResponse);
    
                const result = await mistral.createFineTuningJob(hyperparameters, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mistral.client.createFineTuningJob).toHaveBeenCalledWith(hyperparameters, modelId, config);
            });
            it("Test call 'startFineTuningJob' on the client instance", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = { 
                    id: "id-test-response",
                    auto_start: true,
                    model: "model-test-id",
                    status: "QUEUED"
                };
                mockClientInstance.startFineTuningJob.mockResolvedValue(mockResponse);
                
                const result = await mistral.startFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.startFineTuningJob).toHaveBeenCalledWith(fine_tuning_job_id);
            });
            it("Test call 'cancelFineTuningJob' on the client instance", async () => {
                const fine_tuning_job_id = "fine-tuned-job-test-id";
                const mockResponse = {
                    id: fine_tuning_job_id,
                    object: "model",
                    auto_start: true,
                    status: "QUEUED"
                };
                mockClientInstance.cancelFineTuningJob.mockResolvedValue(mockResponse);
                
                const result = await mistral.cancelFineTuningJob(fine_tuning_job_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.cancelFineTuningJob).toHaveBeenCalledWith(fine_tuning_job_id);
            });
        });
        
        describe("Fine-Tuning Models Methods", () => {
            it("Test call 'updateFineTuningModel' on the client instance", async () => {
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
                mockClientInstance.updateFineTuningModel.mockResolvedValue(mockResponse);
                
                const result = await mistral.updateFineTuningModel(fine_tuning_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.updateFineTuningModel).toHaveBeenCalledWith(fine_tuning_model_id, config);
            });
            it("Test call 'archiveFineTuningModel' on the client instance", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    archived: false
                };
                mockClientInstance.archiveFineTuningModel.mockResolvedValue(mockResponse);
                
                const result = await mistral.archiveFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.archiveFineTuningModel).toHaveBeenCalledWith(fine_tuning_model_id);
            });
            it("Test call 'unarchiveFineTuningModel' on the client instance", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    archived: false
                };
                mockClientInstance.unarchiveFineTuningModel.mockResolvedValue(mockResponse);
                
                const result = await mistral.unarchiveFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.unarchiveFineTuningModel).toHaveBeenCalledWith(fine_tuning_model_id);
            });
            it("Test call 'deleteFineTuningModel' on the client instance", async () => {
                const fine_tuning_model_id = "fine-tuned-model-test-id";
                const mockResponse = {
                    id: fine_tuning_model_id,
                    object: "model",
                    deleted: true
                };
                mockClientInstance.deleteFineTuningModel.mockResolvedValue(mockResponse);
                
                const result = await mistral.deleteFineTuningModel(fine_tuning_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteFineTuningModel).toHaveBeenCalledWith(fine_tuning_model_id);
            });
        });
    });
    
    
    describe("Throw the AIConnectifyError error", () => {
         it("Tests when API key is not provided", () => {
            expect(() => new Mistral()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new Mistral('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });
});