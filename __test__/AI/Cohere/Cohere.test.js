import Cohere from '../../../lib/connectors/AI/Cohere/Cohere';
import CohereClient from '../../../lib/connectors/AI/Cohere/CohereClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';
import FormData from 'form-data';

jest.mock('../../../lib/connectors/AI/Cohere/CohereClient');
jest.mock('form-data');

describe("Cohere class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let cohere;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setClientName: jest.fn(),
            authorizeConnector: jest.fn(),
            cancelEmbedJob: jest.fn(),
            chat: jest.fn(),
            chatWithStreaming: jest.fn(),
            classify: jest.fn(),
            createConnector: jest.fn(),
            createDataset: jest.fn(),
            createEmbedJob: jest.fn(),
            createFineTunedModel: jest.fn(),
            deleteConnector: jest.fn(),
            deleteDataset: jest.fn(),
            deleteFineTunedModel: jest.fn(),
            detokenize: jest.fn(),
            embed: jest.fn(),
            getConnector: jest.fn(),
            getConnectors: jest.fn(),
            getDataset: jest.fn(),
            getDatasets: jest.fn(),
            getDatasetUsage: jest.fn(),
            getEmbedJob: jest.fn(),
            getEmbedJobs: jest.fn(),
            getFineTunedModel: jest.fn(),
            getFineTunedModelChronology: jest.fn(),
            getFineTunedModelMetrics: jest.fn(),
            getFineTunedModels: jest.fn(),
            getModel: jest.fn(),
            getModels: jest.fn(),
            rerank: jest.fn(),
            tokenize: jest.fn(),
            updateConnector: jest.fn(),
            updateFineTunedModel: jest.fn()    
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
        });

        describe("Chat methods", () => {
            it("Test call 'chat' on the client instance", async () => {
                const messagesArray = [{  role: "user", content: "Hello world!" }];
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    finish_reason: "COMPLETE",
                    message: {
                        role: "assistant",
                        content: [{
                            "type": "text",
                            "text": "LLMs stand for Large Language Models, which are a type of neural network model specialized in processing and generating human language."
                        }]
                    }
                };
                mockClientInstance.chat.mockResolvedValue(mockResponse);

                const result = await cohere.chat(messagesArray, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.chat).toHaveBeenCalledWith(messagesArray, modelId, config);
            });
            it("Test call 'chatWithStreaming' on the client instance", async () => {
                const messagesArray = [{  role: "user", content: "Hello world!" }];
                const modelId = 'model-test-id';
                const config = { max_tokens: 0.7 };
                const mockResponse = {
                    id: "id-test-response",
                    finish_reason: "COMPLETE",
                    message: {
                        role: "assistant",
                        content: [{
                            "type": "text",
                            "text": "LLMs stand for Large Language Models, which are a type of neural network model specialized in processing and generating human language."
                        }]
                    }
                };
                mockClientInstance.chatWithStreaming.mockResolvedValue(mockResponse);

                const result = await cohere.chatWithStreaming(messagesArray, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.chatWithStreaming).toHaveBeenCalledWith(messagesArray, modelId, config);
            });
        });

        describe("Embed methods", () => {
            it("Test call 'embed' on the client instance", async () => {
                const input_type = 'input-image-test';
                const embedding_types = ["float"];
                const modelID = 'model-test-id';
                const config = { truncate: "NONE" };
                const mockResponse = { 
                    id: "5807ee2e-0cda-445a-9ec8-864c60a06606",
                    embeddings: { float: [[-0.007247925, -0.041229248, -0.023223877, -0.08392334, -0.03378296]] },
                    texts: [],
                    images: [{
                        width: 400,
                        height: 400,
                        format: "jpeg",
                        bit_depth: 24
                    }],
                    meta: { api_version: { version: 2 } }
                };
                mockClientInstance.embed.mockResolvedValue(mockResponse);

                const result = await cohere.embed(input_type, embedding_types, modelID, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.embed).toHaveBeenCalledWith(input_type, embedding_types, modelID, config);
            });
        });
        describe("Embed Jobs methods", () => {
            it("Test call 'getEmbedJobs' on the client instance", async () => {
                const mockResponse = {
                    embed_jobs : [
                        {
                            job_id: "job_id_1",
                            status: "processing",
                            model: "model",
                            name: "name",
                            meta: { 
                                api_version: { version: "version" } 
                            }
                        },
                        {
                            job_id: "job_id_2",
                            status: "processing",
                            model: "model",
                            name: "name",
                            meta: { 
                                api_version: { version: "version" } 
                            }
                        }
                    ]
                };
                mockClientInstance.getEmbedJobs.mockResolvedValue(mockResponse);

                const result = await cohere.getEmbedJobs();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getEmbedJobs).toHaveBeenCalled();
            });
            it("Test call 'getEmbedJob' on the client instance", async () => {
                const embed_job_id = "embed-job-test-id";
                const mockResponse = {
                    job_id: embed_job_id,
                    status: "processing",
                    model: "model",
                    name: "name",
                    meta: {  api_version: { version: "version" } }
                };
                mockClientInstance.getEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.getEmbedJob(embed_job_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getEmbedJob).toHaveBeenCalledWith(embed_job_id);
            });
            it("Test call 'createEmbedJob' on the client instance", async () => {
                const dataset_id = 'dataset-id-test';
                const modelID = 'model-test-id';
                const input_type = 'dataset-type-test';
                const config = { keep_original_file: true };
                const mockResponse = { job_id: "id-test-response" };
                mockClientInstance.createEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.createEmbedJob(dataset_id, modelID, input_type, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createEmbedJob).toHaveBeenCalledWith(dataset_id, modelID, input_type, config);
            });
            it("Test call 'cancelEmbedJob' on the client instance", async () => {
                const embed_job_id = "embed-job-test-id";
                const mockResponse = { embed_job_id: embed_job_id, status: "canceled" };
                mockClientInstance.cancelEmbedJob.mockResolvedValue(mockResponse);

                const result = await cohere.cancelEmbedJob(embed_job_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.cancelEmbedJob).toHaveBeenCalledWith(embed_job_id);
            });
        });

        describe("Rerank methods", () => {
            it("Test call 'rerank' on the client instance", async () => {
                const query = "What is the capital of the United States?";
                const documents = [
                    "Carson City is the capital city of the American state of Nevada.",
                    "Washington, D.C. (also known as simply Washington or D.C."
                ]
                const modelId = 'model-test-id';
                const config = { top_n: 3 };
                const mockResponse = {
                    results: [
                        { index: 1, relevance_score: 0.999071 },
                        { index: 0, relevance_score: 0.7867867 }
                    ],
                    id: "test-id-response",
                    meta: { api_version: { version: 2 } }
                };
                mockClientInstance.rerank.mockResolvedValue(mockResponse);

                const result = await cohere.rerank(query, documents, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.rerank).toHaveBeenCalledWith(query, documents, modelId, config);
            });
        });

        describe("Classify methods", () => {
            it("Test call 'classify' on the client instance", async () => {
                const inputs = ["Confirm your email address", "hey i need u to send some $"];
                const examples = [
                    {"text": "Dermatologists don't like her!","label": "Spam"},
                    {"text": "I need help please wire me $1000 right now","label": "Spam"} 
                ];
                const modelId = 'model-test-id';
                const config = { truncate: "NONE" };
                const mockResponse = {
                    id: "id-test-response",
                    classifications: [{
                        "id": "842d12fe-934b-4b71-82c2-c581eca00718",
                        "predictions": [ "Not spam" ],
                        "confidences": [ 0.5661598 ],
                        "labels": {
                            "Not spam": { "confidence": 0.5661598 },
                            "Spam": { "confidence": 0.43384025 }
                        },
                        "classification_type": "single-label",
                        "input": "Confirm your email address",
                        "prediction": "Not spam",
                        "confidence": 0.5661598
                    }]
                };
                mockClientInstance.classify.mockResolvedValue(mockResponse);

                const result = await cohere.classify(inputs, examples, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.classify).toHaveBeenCalledWith(inputs, examples, modelId, config);
            });
        });

        describe("Dataset methods", () => {
            it("Test call 'getDatasets' on the client instance", async () => {
                const config = { limit: 50 };
                const mockResponse = {
                    datasets: [
                        { id: "id", name: "name", schema: "schema", dataset_type: "dataset_type" },
                        { id: "id2", name: "name", schema: "schema", dataset_type: "dataset_type"}
                    ]
                };
                mockClientInstance.getDatasets.mockResolvedValue(mockResponse);

                const result = await cohere.getDatasets(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDatasets).toHaveBeenCalledWith(config);
            });
            it("Test call 'getDataset' on the client instance", async () => {
                const dataset_id = 'dataset-test-id';
                const mockResponse = {
                    dataset: { id: dataset_id, name: "name", schema: "schema", dataset_type: "dataset_type" }
                };
                mockClientInstance.getDataset.mockResolvedValue(mockResponse);

                const result = await cohere.getDataset(dataset_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDataset).toHaveBeenCalledWith(dataset_id);
            });
            it("Test call 'getDatasetUsage' on the client instance", async () => {
                const mockResponse = { "organization_usage": 1000000 };
                mockClientInstance.getDatasetUsage.mockResolvedValue(mockResponse);

                const result = await cohere.getDatasetUsage();
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getDatasetUsage).toHaveBeenCalled();
            });
            it("Test call 'createDataset' on the client instance", async () => {
                const name = 'dataset-name-test';
                const filePath = './path/to/file.json';
                const type = 'dataset-type-test';
                const config = { keep_original_file: true };
                const mockFormData = {
                    append: jest.fn(),
                    getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
                };
                FormData.mockImplementation(() => mockFormData);

                const mockResponse = { id: "id-test-response" };
                mockClientInstance.createDataset.mockResolvedValue(mockResponse);

                const result = await cohere.createDataset(name, filePath, type, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createDataset).toHaveBeenCalledWith(name, filePath, type, config);
            });
            it("Test call 'deleteDataset' on the client instance", async () => {
                const dataset_id = 'dataset-test-id';
                const mockResponse = { dataset_id, status: "deleted" };
                mockClientInstance.deleteDataset.mockResolvedValue(mockResponse);

                const result = await cohere.deleteDataset(dataset_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteDataset).toHaveBeenCalledWith(dataset_id);
            });
        });

        describe("Token Methods", () => {
            it("Test call 'tokenize' on the client instance", async () => {
                const text = "tokenize me! :D";
                const modelId = "model-test-id";
                const mockResponse = {
                    tokens: [8466, 5169, 2594, 8, 2792, 43],
                    token_strings: ["token", "ize", " me", "!", " :", "D"],
                    meta: { api_version: { version: 2 } }
                };
                mockClientInstance.tokenize.mockResolvedValue(mockResponse);
                
                const result = await cohere.tokenize(text, modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.tokenize).toHaveBeenCalledWith(text, modelId);
            });
            it("Test call 'detokenize' on the client instance", async () => {
                const tokens = [8466, 5169, 2594, 8, 2792, 43];
                const modelId = "model-test-id";
                const mockResponse = {
                    text: "tokenize me! :D",
                    meta: { api_version: { version: 2 } }
                };
                mockClientInstance.detokenize.mockResolvedValue(mockResponse);
                
                const result = await cohere.detokenize(tokens, modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.detokenize).toHaveBeenCalledWith(tokens, modelId);
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' on the client instance", async () => {
                const config = { page_token: "page_token" };
                const mockResponse = {
                    models: [
                        { name: "name1", endpoints: ["chat"], finetuned: true, context_length: 1.1, tokenizer_url: "tokenizer_url" },
                        { name: "name2", endpoints: ["chat"], finetuned: true, context_length: 1.1, tokenizer_url: "tokenizer_url" }
                    ]
                };
                mockClientInstance.getModels.mockResolvedValue(mockResponse);
                
                const result = await cohere.getModels(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModels).toHaveBeenCalledWith(config);
            });
            it("Test call 'getModel' on the client instance with the correct modelID", async () => {
                const modelId = 'model-test-id';
                const mockResponse = {
                    name: "name",
                    endpoints: ["chat"],
                    finetuned: true,
                    context_length: 1.1,
                    tokenizer_url: "tokenizer_url"
                };
                mockClientInstance.getModel.mockResolvedValue(mockResponse);
                
                const result = await cohere.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getModel).toHaveBeenCalledWith(modelId);
            });
        });

        describe("Connector methods", () => {
            it("Test call 'getConnectors' on the client instance", async () => {
                const config = { limit: 50 };
                const mockResponse = {
                    connectors: [
                        { id: "id", name: "name", auth_status: "valid", active: true },
                        { id: "id2", name: "name2", auth_status: "valid", active: true }
                    ]
                };
                mockClientInstance.getConnectors.mockResolvedValue(mockResponse);

                const result = await cohere.getConnectors(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getConnectors).toHaveBeenCalledWith(config);
            });
            it("Test call 'getConnector' on the client instance", async () => {
                const connector_id = 'connector-test-id';
                const mockResponse = { connector: { id: connector_id, name: "name", auth_status: "valid", active: true } };
                mockClientInstance.getConnector.mockResolvedValue(mockResponse);

                const result = await cohere.getConnector(connector_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getConnector).toHaveBeenCalledWith(connector_id);
            });
            it("Test call 'createConnector' on the client instance", async () => {
                const name = "Example connector";
                const url = "https://connector-example.com/search";
                const config = { description: "connector description for testing" };
                const mockResponse = {
                    "connector": {
                        id: "id",
                        name: name,
                        created_at: "2024-01-15T09:30:00Z",
                        updated_at: "2024-01-15T09:30:00Z",
                        organization_id: "organization_id",
                        description: config.description,
                        url: url,
                    }
                };
                mockClientInstance.createConnector.mockResolvedValue(mockResponse);

                const result = await cohere.createConnector(name, url, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createConnector).toHaveBeenCalledWith(name, url, config);
            });
            it("Test call 'updateConnector' on the client instance", async () => {
                const connector_id = 'connector-test-id';
                const config = {  name: "name for update", url: "https://example.com/search" };
                const mockResponse = {
                    "connector": {
                        id: connector_id,
                        name: config.name,
                        created_at: "2024-01-15T09:30:00Z",
                        updated_at: "2024-01-15T09:30:00Z",
                        organization_id: "organization_id",
                        url: config.url,
                    }
                };
                mockClientInstance.updateConnector.mockResolvedValue(mockResponse);

                const result = await cohere.updateConnector(connector_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.updateConnector).toHaveBeenCalledWith(connector_id, config);
            });
            it("Test call 'authorizeConnector' on the client instance", async () => {
                const connector_id = 'connector-test-id';
                const afterTokenRedirectUrl = "http://www.test-redirect.com";
                const mockResponse = { redirect_url: afterTokenRedirectUrl };
                mockClientInstance.authorizeConnector.mockResolvedValue(mockResponse);

                let result = await cohere.authorizeConnector(connector_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.authorizeConnector).toHaveBeenCalledWith(connector_id, false);

                result = await cohere.authorizeConnector(connector_id, afterTokenRedirectUrl);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.authorizeConnector).toHaveBeenCalledWith(connector_id, afterTokenRedirectUrl);
            });
            it("Test call 'deleteConnector' on the client instance", async () => {
                const connector_id = 'connector-test-id';
                const mockResponse = { connector_id: connector_id, status: "deleted" };
                mockClientInstance.deleteConnector.mockResolvedValue(mockResponse);

                const result = await cohere.deleteConnector(connector_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.deleteConnector).toHaveBeenCalledWith(connector_id);
            });
        });

        describe("Fine-tuned methods", () => {
            it("Test call 'getFineTunedModels' on the client instance", async () => {
                const config = { next_page_token: "next_page_token" }
                const mockResponse = {
                    finetuned_models: [
                        { id: "id1", name: "name", status: "STATUS_READY" },
                        { id: "id2", name: "name", status: "STATUS_READY" }
                    ]
                };
                mockClientInstance.getFineTunedModels.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModels(config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModels).toHaveBeenCalledWith(config);
            });
            it("Test call 'getFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const mockResponse = {
                    finetuned_model: {
                        id: finetuned_model_id,
                        name: "name",
                        status: "STATUS_READY"
                    }
                };
                mockClientInstance.getFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModel).toHaveBeenCalledWith(finetuned_model_id);
            });
            it("Test call 'getFineTunedModelChronology' on the client instance", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const config = { next_page_token: "next_page_token" };
                const mockResponse = {
                    events: [
                        {
                            user_id: "7a317d97-4d05-427d-9396-f31b9fb92c55",
                            status: "STATUS_QUEUED",
                            created_at: "2024-01-17T20:11:45Z"
                        },
                        {
                            user_id: "7a317d97-4d05-427d-9396-f31b9fb92c55",
                            status: "STATUS_FINETUNING",
                            created_at: "2024-01-17T20:11:46Z"
                        }
                    ]
                };
                mockClientInstance.getFineTunedModelChronology.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModelChronology(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModelChronology).toHaveBeenCalledWith(finetuned_model_id, config);
            });
            it("Test call 'getFineTunedModelMetrics' on the client instance", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const config = { next_page_token: "next_page_token" };
                const mockResponse = {
                    step_metrics: [
                        {
                            step_number: 1,
                            created_at: "2024-01-17T20:11:45Z",
                            metrics: {
                                accuracy: 0.4557601809501648,
                                cross_entropy: 4.264331340789795,
                                generation_accuracy: 0.4557601809501648,
                                generation_cross_entropy: 4.264331340789795,
                                step: 0
                            }
                        },
                        {
                            step_number: 9,
                            created_at: "2024-01-17T20:25:19Z",
                            metrics: {
                                accuracy: 0.7393720149993896,
                                cross_entropy: 0.7702581286430359,
                                generation_accuracy: 0.7393720149993896,
                                generation_cross_entropy: 0.7702581286430359,
                                step: 9
                            }
                        }
                    ]
                };
                mockClientInstance.getFineTunedModelMetrics.mockResolvedValue(mockResponse);
    
                const result = await cohere.getFineTunedModelMetrics(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.getFineTunedModelMetrics).toHaveBeenCalledWith(finetuned_model_id, config);
            });
            it("Test call 'createFineTunedModel' on the client instance", async () => {
                const name = 'fine-tuned-model-name-test';
                const settings = {
                    base_model: { base_type: "BASE_TYPE_CHAT" },
                    dataset_id: "STATUS_READY"
                };
                const config = { status: true };
                const mockResponse = { 
                    finetuned_model: {
                        name: name,
                        settings: {
                            base_model: settings.base_model,
                            dataset_id: settings.dataset_id,
                            multi_label: true
                        },
                        id: "id-test-response",
                        creator_id: "creator_id_response",
                    }
                };
                mockClientInstance.createFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.createFineTunedModel(name, settings, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createFineTunedModel).toHaveBeenCalledWith(name, settings, config);
            });
            it("Test call 'updateFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const name = 'fine-tuned-model-name-test';
                const settings = {
                    base_model: { base_type: "BASE_TYPE_CHAT" },
                    dataset_id: "STATUS_READY"
                };
                const config = { status: true };
                const mockResponse = { 
                    finetuned_model: {
                        name: name,
                        settings: {
                            base_model: settings.base_model,
                            dataset_id: settings.dataset_id,
                            multi_label: true
                        },
                        id: finetuned_model_id,
                        creator_id: "creator_id_response",
                    }
                };
                mockClientInstance.updateFineTunedModel.mockResolvedValue(mockResponse);
    
                const result = await cohere.updateFineTunedModel(finetuned_model_id, name, settings, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.updateFineTunedModel).toHaveBeenCalledWith(finetuned_model_id, name, settings, config);
            });
            it("Test call 'deleteFineTunedModel' on the client instance", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const mockResponse = { finetuned_model_id: finetuned_model_id, status: "deleted" };
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