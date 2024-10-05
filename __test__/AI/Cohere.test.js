import Cohere from '../../lib/connectors/AI/Cohere/Cohere';
import CohereClient from '../../lib/connectors/AI/Cohere/CohereClient';
import AIConnectifyError from '../../lib/AIConnectifyError';

jest.mock('../../lib/connectors/AI/Cohere/CohereClient');

describe("Cohere class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let cohere;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setClientName: jest.fn(),
            checkApiKey: jest.fn(),
            chat: jest.fn(),
            chatWithStreaming: jest.fn(),
            embed: jest.fn(),
            getEmbedJobs: jest.fn(),
            getEmbedJob: jest.fn(),
            createEmbedJob: jest.fn(),
            cancelEmbedJob: jest.fn(),
            rerank: jest.fn(),
            classify: jest.fn(),
            getDatasets: jest.fn(),
            getDataset: jest.fn(),
            getDatasetUsage: jest.fn(),
            createDataset: jest.fn(),
            deleteDataset: jest.fn(),
            tokenize: jest.fn(),
            detokenize: jest.fn(),
            getModels: jest.fn(),
            getModel: jest.fn(),
            getConnectors: jest.fn(),
            getConnector: jest.fn(),
            createConnector: jest.fn(),
            updateConnector: jest.fn(),
            deleteConnector: jest.fn(),
            getFineTunedModels: jest.fn(),
            getFineTunedModel: jest.fn(),
            getFineTunedChronology: jest.fn(),
            getFineTunedMetrics: jest.fn(),
            createFineTunedModel: jest.fn(),
            updateFineTunedModel: jest.fn(),
            deleteFineTunedModel: jest.fn()
        };
        CohereClient.mockImplementation(() => mockClientInstance);
        cohere = new Cohere(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(cohere).toBeInstanceOf(Cohere);
            expect(CohereClient).toHaveBeenCalledWith(mockApiKey);
        });
    });

    describe("Use each method individually", () => {
        describe("Client and API Key methods", () => {
            it("Test call 'setClientName' on the client instance", () => {
                const clientName = 'test-client';
                cohere.setClientName(clientName);
                expect(mockClientInstance.setClientName).toHaveBeenCalledWith(clientName);
            });
            it("Test call 'checkApiKey' on the client instance", async () => {
                const mockResponse = { valid: true };
                mockClientInstance.checkApiKey.mockResolvedValue(mockResponse);
    
                const result = await cohere.checkApiKey();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.checkApiKey).toHaveBeenCalled();
            });
        });

        describe("Chat methods", () => {
            const modelId = 'test-model';
            const config = { temperature: 0.7 };
    
            it("Test call 'chat' on the client instance", async () => {
                const messages = [{ role: "user", message: "Hello world!"}];
                const mockResponse = { id: 'id-response', message: 'Hello there!' };
                mockClientInstance.chat.mockResolvedValue(mockResponse);

                const result = await cohere.chat(messages, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.chat).toHaveBeenCalledWith(messages, modelId, config);
            });
            it("Test call 'chatWithStreaming' on the client instance", async () => {
                const messages = [{ role: "user", message: "Hello world!"}];
                const mockResponse = [{ id: 'id-response', type: 'message-start' }, { id: 'id-response', type: 'message-end' }];
                mockClientInstance.chatWithStreaming.mockResolvedValue(mockResponse);

                const result = await cohere.chatWithStreaming(messages, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.chatWithStreaming).toHaveBeenCalledWith(messages, modelId, config);
            });
        });

        describe("Embed methods", () => {
            const modelId = 'embed-model';
            const config = { truncate: 'END' };

            it("Test call 'embed' on the client instance", async () => {
                const texts = ['text1', 'text2'];
                const mockResponse = { embeddings: [[0.1, 0.2], [0.3, 0.4]] };
                mockClientInstance.embed.mockResolvedValue(mockResponse);

                const result = await cohere.embed(texts, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.embed).toHaveBeenCalledWith(texts, modelId, config);
            });
            it("Test call 'getEmbedJobs' on the client instance", async () => {
                const mockResponse = [{ job_id: 'job_id_1' }, { job_id: 'job_id_2' }];
                mockClientInstance.getEmbedJobs.mockResolvedValue(mockResponse);

                const result = await cohere.getEmbedJobs();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getEmbedJobs).toHaveBeenCalled();
            });
            it("Test call 'getEmbedJob' on the client instance", async () => {
                const jobId = 'job_id_1';
                const mockResponse = { job_id: jobId, status: 'completed' };
                mockClientInstance.getEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.getEmbedJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getEmbedJob).toHaveBeenCalledWith(jobId);
            });
            it("Test call 'createEmbedJob' on the client instance", async () => {
                const dataset_id = 'my-dataset';
                const input_type = 'search_query';
                const mockResponse = 'new_job_id';
                mockClientInstance.createEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.createEmbedJob(dataset_id, modelId, input_type, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createEmbedJob).toHaveBeenCalledWith(dataset_id, modelId, input_type, config);
            });
            it("Test call 'cancelEmbedJob' on the client instance", async () => {
                const jobId = 'job_id_1';
                const mockResponse = { embed_job_id: jobId, status: 'canceled' };
                mockClientInstance.cancelEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.cancelEmbedJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.cancelEmbedJob).toHaveBeenCalledWith(jobId);
            });
        });

        describe("Rerank methods", () => {
            it("Test call 'rerank' on the client instance", async () => {
                const query = 'query message string';
                const documents = ['document text 1', 'document text 2', 'document text 3'];
                const modelId = 'test-model';
                const config = { return_documents: true };
                const mockResponse = { results: { index: 0, relevance_score: 0.32713068 }};
                mockClientInstance.rerank.mockResolvedValue(mockResponse);

                const result = await cohere.rerank(query, documents, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.rerank).toHaveBeenCalledWith(query, documents, modelId, config);
            });
        });

        describe("Classify methods", () => {
            it("Test call 'classify' on the client instance", async () => {
                const inputs = ['document text 1', 'document text 2', 'document text 3'];
                const examples = [{text: 'document text 1'}, {text: 'document text 2'}, {text: 'document text 3'}];
                const modelId = 'test-model';
                const config = { truncate: 'END' };
                const mockResponse = { classifications: [{ id: 'id', prediction: ["No spam"] }]};
                mockClientInstance.classify.mockResolvedValue(mockResponse);

                const result = await cohere.classify(inputs, examples, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.classify).toHaveBeenCalledWith(inputs, examples, modelId, config);
            });
        });

        describe("Dataset methods", () => {
            it("Test call 'getDatasets' on the client instance", async () => {
                const config = { limit: 1.5 }
                const mockResponse = [{ id: 'dataset_1' }, { id: 'dataset_2' }];
                mockClientInstance.getDatasets.mockResolvedValue(mockResponse);

                const result = await cohere.getDatasets(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDatasets).toHaveBeenCalledWith(config);
            });
            it("Test call 'getDataset' on the client instance", async () => {
                const datasetId = 'dataset-id';
                const mockResponse = { id: 'dataset-id', name: 'dataset_name' };
                mockClientInstance.getDataset.mockResolvedValue(mockResponse);

                const result = await cohere.getDataset(datasetId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDataset).toHaveBeenCalledWith(datasetId);
            });
            it("Test call 'getDatasetUsage' on the client instance", async () => {
                const mockResponse = { "organization_usage": 1000000 };
                mockClientInstance.getDatasetUsage.mockResolvedValue(mockResponse);

                const result = await cohere.getDatasetUsage();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDatasetUsage).toHaveBeenCalled();
            });
            it("Test call 'createDataset' on the client instance", async () => {
                const name = 'test-dataset';
                const type = 'embed-input';
                const filePath = '/path/to/file';
                const config = { keep_original_file: true };
                const mockResponse = { dataset_id: 'new-dataset-id' };
                mockClientInstance.createDataset.mockResolvedValue(mockResponse);

                const result = await cohere.createDataset(name, filePath, type, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createDataset).toHaveBeenCalledWith(name, filePath, type, config);
            });
            it("Test call 'deleteDataset' on the client instance", async () => {
                const datasetId = 'dataset-id';
                const mockResponse = { dataset_id: datasetId, status: 'deleted' };
                mockClientInstance.deleteDataset.mockResolvedValue(mockResponse);

                const result = await cohere.deleteDataset(datasetId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteDataset).toHaveBeenCalledWith(datasetId);
            });
        });

        describe("Token Methods", () => {
            const modelId = 'test-model';

            it("Test call 'tokenize' on the client instance", async () => {
                const text = "tokenize"
                const mockResponse = { tokens: [1,2,3] };
                mockClientInstance.tokenize.mockResolvedValue(mockResponse);
                
                const result = await cohere.tokenize(text, modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.tokenize).toHaveBeenCalledWith(text, modelId);
            });
            it("Test call 'detokenize' on the client instance", async () => {
                const tokens = [1,2,3];
                const mockResponse = { text: "tokenize" };
                mockClientInstance.detokenize.mockResolvedValue(mockResponse);
                
                const result = await cohere.detokenize(tokens, modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.detokenize).toHaveBeenCalledWith(tokens, modelId);
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' on the client instance", async () => {
                const config = { default_only: true };
                const mockResponse = { models: [{ name: 'model_name_1' }, { name: 'model_name_2' }]};
                mockClientInstance.getModels.mockResolvedValue(mockResponse);
                
                const result = await cohere.getModels(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModels).toHaveBeenCalledWith(config);
            });
            it("Test call 'getModel' on the client instance with the correct modelID", async () => {
                const modelId = 'test-model';
                const mockResponse = { id: modelId, name: 'Test Model' };
                mockClientInstance.getModel.mockResolvedValue(mockResponse);
                
                const result = await cohere.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModel).toHaveBeenCalledWith(modelId);
            });
        });

        describe("Connector methods", () => {
            it("Test call 'getConnectors' on the client instance", async () => {
                const config = { limit: 1.5 };
                const mockResponse = { connectors: [{ id: 'connector_1', name: 'connector_name' }]};
                mockClientInstance.getConnectors.mockResolvedValue(mockResponse);

                const result = await cohere.getConnectors(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getConnectors).toHaveBeenCalledWith(config);
            });
            it("Test call 'getConnector' on the client instance", async () => {
                const connectorId = 'connector-id';
                const mockResponse = { id: 'connector-id' };
                mockClientInstance.getConnector.mockResolvedValue(mockResponse);

                const result = await cohere.getConnector(connectorId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getConnector).toHaveBeenCalledWith(connectorId);
            });
            it("Test call 'createConnector' on the client instance", async () => {
                const name = 'test-connector';
                const url = 'http://test.com';
                const config = { description: 'connector description' };
                const mockResponse = { id: 'new-connector-id', name, url };
                mockClientInstance.createConnector.mockResolvedValue(mockResponse);

                const result = await cohere.createConnector(name, url, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createConnector).toHaveBeenCalledWith(name, url, config);
            });
            it("Test call 'updateConnector' on the client instance", async () => {
                const connectorId = 'connector-id';
                const config = { url: 'http://newurl.com' };
                const mockResponse = { id: 'connector-id', updated_at: "updated-date" };
                mockClientInstance.updateConnector.mockResolvedValue(mockResponse);

                const result = await cohere.updateConnector(connectorId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.updateConnector).toHaveBeenCalledWith(connectorId, config);
            });
            it("Test call 'deleteConnector' on the client instance", async () => {
                const connectorId = 'connector-id';
                const mockResponse = { connector_id: connectorId, status: 'deleted' };
                mockClientInstance.deleteConnector.mockResolvedValue(mockResponse);

                const result = await cohere.deleteConnector(connectorId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteConnector).toHaveBeenCalledWith(connectorId);
            });
        });

        describe("Fine-tuned methods", () => {
            it("Test call 'getFineTunedModels' on the client instance", async () => {
                const config = { page_size: 5 };
                const mockResponse = { finetuned_models: [{ id: 'ft-id', name: 'ft-name', status: 'STATUS_READY' }] };
                mockClientInstance.getFineTunedModels.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModels(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModels).toHaveBeenCalledWith(config);
            });
            it("Test call 'getFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const mockResponse = { id: finetuned_model_id, name: 'finetuned-model-name' };
                mockClientInstance.getFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModel).toHaveBeenCalledWith(finetuned_model_id);
            });
            it("Test call 'getFineTunedChronology' on the client instance", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const config = { page_size: 5 };
                const mockResponse = { events: [{ user_id: 'user-id', status: 'STATUS_QUEUED' }] };
                mockClientInstance.getFineTunedChronology.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedChronology(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedChronology).toHaveBeenCalledWith(finetuned_model_id, config);
            });
            it("Test call 'getFineTunedMetrics' on the client instance", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const config = { page_size: 5 };
                const mockResponse = { step_metrics: [{ step_number: 1, created_at: 'created-date' }] };
                mockClientInstance.getFineTunedMetrics.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedMetrics(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedMetrics).toHaveBeenCalledWith(finetuned_model_id, config);
            });
            it("Test call 'createFineTunedModel' on the client instance", async () => {
                const name = 'finetuned-model-name';
                const settings = { base_model: { base_type: "BASE_TYPE_CHAT" }, dataset_id: "test-dataset-id" };
                const config = { creator_id: 'creator-id' };
                const mockResponse = { name, settings, id: 'new-finetuned-model-id' };
                mockClientInstance.createFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.createFineTunedModel(name, settings, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createFineTunedModel).toHaveBeenCalledWith(name, settings, config);
            });
            it("Test call 'updateFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const name = 'new-finetuned-model-name';
                const settings = { base_model: { base_type: "BASE_TYPE_CHAT" }, dataset_id: "test-dataset-id" };
                const config = { creator_id: 'creator-id' };
                const mockResponse = { name, settings, id: 'new-finetuned-model-id' };
                mockClientInstance.updateFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.updateFineTunedModel(finetuned_model_id, name, settings, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.updateFineTunedModel).toHaveBeenCalledWith(finetuned_model_id, name, settings, config);
            });
            it("Test call 'deleteFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const mockResponse = { finetuned_model_id: finetuned_model_id, status: 'deleted' };
                mockClientInstance.deleteFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.deleteFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteFineTunedModel).toHaveBeenCalledWith(finetuned_model_id);
            });
        });
    });

    describe("AIConnectifyError is throw in methods", () => {
        it("Tests when API key is not provided", () => {
            expect(() => new Cohere()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new Cohere('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });
});