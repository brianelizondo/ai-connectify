import fs from 'fs';
import FormData from 'form-data';
import CohereClient from '../../../lib/connectors/AI/Cohere/CohereClient';
import HttpClient from '../../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';

jest.mock('../../../lib/connectors/HttpClient/HttpClient');
jest.mock('form-data');

describe("Cohere class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    const mockTestUrl = "https://api.cohere.com";
    let cohereClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn()
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        cohereClient = new CohereClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(cohereClient).toBeInstanceOf(CohereClient);
            expect(cohereClient.aiName).toBe('Cohere');
            expect(cohereClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                Authorization: `bearer ${mockApiKey}`,
            });
        });
    });

    describe("Use each method individually", () => {
        describe("Client and API Key methods", () => {
            it("Test call 'setClientName' method", () => {
                const clientName = 'test-client';
                cohereClient.setClientName(clientName);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                        Authorization: `bearer ${mockApiKey}`,
                        'X-Client-Name': clientName
                });
            });
            it("Test call 'checkApiKey' method", async () => {
                const mockResponse = { status: 200, data: { valid: true } };
                cohereClient.httpRequest.post.mockResolvedValueOnce(mockResponse);
                
                const result = await cohereClient.checkApiKey();
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/check-api-key');
            });
        });

        describe("Chat methods", () => {
            it("Test call 'chat' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.chat(messagesArray, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v2/chat',
                    expect.objectContaining({
                        ...config, 
                        messages: messagesArray,
                        stream: false, 
                        model: modelId
                    })
                );
            });
        });

        describe("Embed methods", () => {
            it("Test call 'embed' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.embed(input_type, embedding_types, modelID, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v2/embed',
                    expect.objectContaining({ 
                        ...config, 
                        input_type, 
                        embedding_types, 
                        model: modelID 
                    })
                );
            });
            it("Test call 'getEmbedJobs' method", async () => {
                const mockResponse = {
                    embed_jobs : [
                        {
                            job_id: "job_id_1",
                            status: "processing",
                            model: "model",
                            name: "name",
                            meta: { api_version: { version: "version" } }
                        },
                        {
                            job_id: "job_id_2",
                            status: "processing",
                            model: "model",
                            name: "name",
                            meta: { api_version: { version: "version" } }
                        }
                    ]
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getEmbedJobs();
                expect(result).toEqual(mockResponse.embed_jobs);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/v1/embed-jobs');
            });
            it("Test call 'getEmbedJob' method", async () => {
                const embed_job_id = "embed-job-test-id";
                const mockResponse = {
                    job_id: embed_job_id,
                    status: "processing",
                    model: "model",
                    name: "name",
                    meta: {  api_version: { version: "version" } }
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getEmbedJob(embed_job_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/v1/embed-jobs/${embed_job_id}`);
            });
            it("Test call 'createEmbedJob' method", async () => {
                const dataset_id = 'dataset-id-test';
                const modelID = 'model-test-id';
                const input_type = 'dataset-type-test';
                const config = { keep_original_file: true };
                const mockResponse = { job_id: "id-test-response" };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.createEmbedJob(dataset_id, modelID, input_type, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/embed-jobs',
                    expect.objectContaining({ 
                        ...config, 
                        model: modelID, 
                        dataset_id: dataset_id, 
                        input_type: input_type 
                    }) 
                );
            });
            it("Test call 'cancelEmbedJob' method", async () => {
                const embed_job_id = "embed-job-test-id";
                const mockResponse = { embed_job_id: embed_job_id, status: "canceled" };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.cancelEmbedJob(embed_job_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(`/v1/embed-jobs/${embed_job_id}/cancel`);
            });
        });

        describe("Rerank methods", () => {
            it("Test call 'rerank' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.rerank(query, documents, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v2/rerank',
                    expect.objectContaining({ 
                        ...config, 
                        query, 
                        documents, 
                        model: modelId 
                    })
                );
            });
        });

        describe("Classify methods", () => {
            it("Test call 'classify' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.classify(inputs, examples, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/classify',
                    expect.objectContaining({
                        ...config, 
                        inputs: inputs, 
                        examples: examples,
                        model: modelId
                    })
                );
            });
        });

        describe("Dataset methods", () => {
            it("Test call 'getDatasets' method", async () => {
                const config = { limit: 50 };
                const mockResponse = {
                    datasets: [
                        { id: "id", name: "name", schema: "schema", dataset_type: "dataset_type" },
                        { id: "id2", name: "name", schema: "schema", dataset_type: "dataset_type"}
                    ]
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDatasets(config);
                expect(result).toEqual(mockResponse.datasets);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    '/v1/datasets', 
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'getDataset' method", async () => {
                const dataset_id = 'dataset-test-id';
                const mockResponse = {
                    dataset: { id: dataset_id, name: "name", schema: "schema", dataset_type: "dataset_type" }
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDataset(dataset_id);
                expect(result).toEqual(mockResponse.dataset);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/v1/datasets/${dataset_id}`);
            });
            it("Test call 'getDatasetUsage' method", async () => {
                const mockResponse = { "organization_usage": 1000000 };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDatasetUsage();
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/v1/datasets/usage');
            });
            it("Test call 'createDataset' method", async () => {
                const name = 'dataset-name-test';
                const filePath = './path/to/file.json';
                const type = 'dataset-type-test';
                const config = { keep_original_file: true };
                const mockResponse = { id: "id-test-response" };
                
                const mockFileStream = {
                    on: jest.fn(),
                    pipe: jest.fn(),
                    destroy: jest.fn(),
                };
                const createReadStreamSpy = jest.spyOn(fs, 'createReadStream').mockReturnValue(mockFileStream);

                mockHttpClient.post.mockResolvedValue(mockResponse);
                const appendSpy = jest.spyOn(FormData.prototype, 'append');
                const getHeadersSpy = jest.spyOn(FormData.prototype, 'getHeaders').mockReturnValue({ 'content-type': 'multipart/form-data' });
                
                const result = await cohereClient.createDataset(name, filePath, type, config);
                
                expect(mockFileStream.on).toHaveBeenCalledWith('error', expect.any(Function));
                expect(result).toEqual({ dataset_id: mockResponse.id });
                expect(createReadStreamSpy).toHaveBeenCalledWith(filePath);
                expect(appendSpy).toHaveBeenCalledWith('data', mockFileStream);
                expect(appendSpy).toHaveBeenCalledWith('name', name);
                expect(appendSpy).toHaveBeenCalledWith('type', type);
                expect(appendSpy).toHaveBeenCalledWith('keep_original_file', true);
                expect(getHeadersSpy).toHaveBeenCalled();
                expect(mockHttpClient.post).toHaveBeenCalledWith(
                    '/v1/datasets',
                    expect.any(FormData),
                    expect.objectContaining({ headers: expect.any(Object) })
                );

                createReadStreamSpy.mockRestore();
                appendSpy.mockRestore();
                getHeadersSpy.mockRestore();
            });
            it("Test call 'deleteDataset' method", async () => {
                const dataset_id = 'dataset-test-id';
                const mockResponse = { dataset_id, status: "deleted" };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await cohereClient.deleteDataset(dataset_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/v1/datasets/${dataset_id}`);
            });
        });

        describe("Token Methods", () => {
            it("Test call 'tokenize' method", async () => {
                const text = "tokenize me! :D";
                const modelId = "model-test-id";
                const mockResponse = {
                    tokens: [8466, 5169, 2594, 8, 2792, 43],
                    token_strings: ["token", "ize", " me", "!", " :", "D"],
                    meta: { api_version: { version: 2 } }
                };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.tokenize(text, modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/tokenize', 
                    expect.objectContaining({ 
                        text: text, 
                        model: modelId 
                    })
                );
            });
            it("Test call 'detokenize' method", async () => {
                const tokens = [8466, 5169, 2594, 8, 2792, 43];
                const modelId = "model-test-id";
                const mockResponse = {
                    text: "tokenize me! :D",
                    meta: { api_version: { version: 2 } }
                };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.detokenize(tokens, modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/detokenize', 
                    expect.objectContaining({ 
                        tokens: tokens, 
                        model: modelId 
                    })
                );
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' method", async () => {
                const config = { page_token: "page_token" };
                const mockResponse = {
                    models: [
                        { name: "name1", endpoints: ["chat"], finetuned: true, context_length: 1.1, tokenizer_url: "tokenizer_url" },
                        { name: "name2", endpoints: ["chat"], finetuned: true, context_length: 1.1, tokenizer_url: "tokenizer_url" }
                    ]
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.getModels(config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    '/v1/models', 
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'getModel' method with the correct modelID", async () => {
                const modelId = 'model-test-id';
                const mockResponse = {
                    name: "name",
                    endpoints: ["chat"],
                    finetuned: true,
                    context_length: 1.1,
                    tokenizer_url: "tokenizer_url"
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/v1/models/${modelId}`);
            });
        });

        describe("Connector methods", () => {
            it("Test call 'getConnectors' method", async () => {
                const config = { limit: 50 };
                const mockResponse = {
                    connectors: [
                        { id: "id", name: "name", auth_status: "valid", active: true },
                        { id: "id2", name: "name2", auth_status: "valid", active: true }
                    ]
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getConnectors(config);
                expect(result).toEqual(mockResponse.connectors);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    '/v1/connectors', 
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'getConnector' method", async () => {
                const connector_id = 'connector-test-id';
                const mockResponse = { connector: { id: connector_id, name: "name", auth_status: "valid", active: true } };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getConnector(connector_id);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/v1/connectors/${connector_id}`);
            });
            it("Test call 'createConnector' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.createConnector(name, url, config);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/connectors',
                    expect.objectContaining({ 
                        ...config, 
                        name: name, 
                        url: url 
                    })
                );
            });
            it("Test call 'updateConnector' method", async () => {
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
                cohereClient.httpRequest.patch.mockResolvedValue(mockResponse);

                const result = await cohereClient.updateConnector(connector_id, config);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.patch).toHaveBeenCalledWith(
                    `/v1/connectors/${connector_id}`,
                    expect.objectContaining({ ...config })
                );
            });
            it("Test call 'authorizeConnector' method", async () => {
                const connector_id = 'connector-test-id';
                const afterTokenRedirectUrl = "http://www.test-redirect.com";
                const mockResponse = { redirect_url: afterTokenRedirectUrl };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                let result = await cohereClient.authorizeConnector(connector_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(`/v1/connectors/${connector_id}/oauth/authorize`);

                result = await cohereClient.authorizeConnector(connector_id, afterTokenRedirectUrl);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(`/v1/connectors/${connector_id}/oauth/authorize?after_token_redirect=${afterTokenRedirectUrl}`);
            });
            it("Test call 'deleteConnector' method", async () => {
                const connector_id = 'connector-test-id';
                const mockResponse = { connector_id: connector_id, status: "deleted" };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await cohereClient.deleteConnector(connector_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/v1/connectors/${connector_id}`);
            });
        });

        describe("Fine-tuned methods", () => {
            it("Test call 'getFineTunedModels' method", async () => {
                const config = { next_page_token: "next_page_token" }
                const mockResponse = {
                    finetuned_models: [
                        { id: "id1", name: "name", status: "STATUS_READY" },
                        { id: "id2", name: "name", status: "STATUS_READY" }
                    ]
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModels(config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    '/v1/finetuning/finetuned-models',
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'getFineTunedModel' method", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const mockResponse = {
                    finetuned_model: {
                        id: finetuned_model_id,
                        name: "name",
                        status: "STATUS_READY"
                    }
                };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
            });
            it("Test call 'getFineTunedModelChronology' method", async () => {
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
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModelChronology(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    `/v1/finetuning/finetuned-models/${finetuned_model_id}/events`,
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'getFineTunedModelMetrics' method", async () => {
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
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModelMetrics(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(
                    `/v1/finetuning/finetuned-models/${finetuned_model_id}/training-step-metrics`,
                    expect.objectContaining({
                        params: { ...config }
                    })
                );
            });
            it("Test call 'createFineTunedModel' method", async () => {
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
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.createFineTunedModel(name, settings, config);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(
                    '/v1/finetuning/finetuned-models', 
                    expect.objectContaining({
                        ...config, 
                        name: name, 
                        settings: settings 
                    })
                );
            });
            it("Test call 'updateFineTunedModel' method", async () => {
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
                cohereClient.httpRequest.patch.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.updateFineTunedModel(finetuned_model_id, name, settings, config);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.patch).toHaveBeenCalledWith(
                    `/v1/finetuning/finetuned-models/${finetuned_model_id}`,
                    expect.objectContaining({ 
                        ...config,
                        name: name, 
                        settings: settings
                    })
                );
            });
            it("Test call 'deleteFineTunedModel' method", async () => {
                const finetuned_model_id = 'fine-tuned-model-test-id';
                const mockResponse = { finetuned_model_id: finetuned_model_id, status: "deleted" };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.deleteFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/v1/finetuning/finetuned-models/${finetuned_model_id}`);
            });
        });
    });

    describe("AIConnectifyError is throw in methods", () => {
        it("Test when Client Name is not provided", () => {
            expect(() => cohereClient.setClientName()).toThrow(AIConnectifyError);
        });
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
            mockHttpClient.patch.mockRejectedValue(new Error('API Error'));
            mockHttpClient.delete.mockRejectedValue(new Error('API Error'));
        });
        it("Test when 'chat' request failure", async () => {
            await expect(cohereClient.chat()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.chat([])).rejects.toThrow('Cannot process the messages');
            await expect(cohereClient.chat(123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.chat(['test'])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.chat(['test'], '')).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.chat(['test'], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'chatWithStreaming' request failure", async () => {
            await expect(cohereClient.chatWithStreaming()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.chatWithStreaming([])).rejects.toThrow('Cannot process the messages');
            await expect(cohereClient.chatWithStreaming(123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.chatWithStreaming(['test'])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.chatWithStreaming(['test'], '')).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.chatWithStreaming(['test'], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'embed' request failure", async () => {
            await expect(cohereClient.embed()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.embed([])).rejects.toThrow('Cannot process the input type');
            await expect(cohereClient.embed(123)).rejects.toThrow('Cannot process the input type');

            await expect(cohereClient.embed('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.embed('test', [])).rejects.toThrow('Cannot process the embedding types');
            await expect(cohereClient.embed('test', 123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.embed('test', ['test'])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.embed('test', ['test'], [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.embed('test', ['test'], 123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getEmbedJob' request failure", async () => {
            await expect(cohereClient.getEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getEmbedJob([])).rejects.toThrow('Cannot process the embed job ID');
            await expect(cohereClient.getEmbedJob(123)).rejects.toThrow('Cannot process the embed job ID');
        });
        it("Test when 'createEmbedJob' request failure", async () => {
            await expect(cohereClient.createEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createEmbedJob([])).rejects.toThrow('Cannot process the dataset ID');
            await expect(cohereClient.createEmbedJob(123)).rejects.toThrow('Cannot process the dataset ID');

            await expect(cohereClient.createEmbedJob('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createEmbedJob('test', [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.createEmbedJob('test', 123)).rejects.toThrow('Cannot process the model ID');

            await expect(cohereClient.createEmbedJob('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createEmbedJob('test', 'test', [])).rejects.toThrow('Cannot process the input type');
            await expect(cohereClient.createEmbedJob('test', 'test', 123)).rejects.toThrow('Cannot process the input type');
        });
        it("Test when 'cancelEmbedJob' request failure", async () => {
            await expect(cohereClient.cancelEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.cancelEmbedJob([])).rejects.toThrow('Cannot process the embed job ID');
            await expect(cohereClient.cancelEmbedJob(123)).rejects.toThrow('Cannot process the embed job ID');
        });
        it("Test when 'rerank' request failure", async () => {
            await expect(cohereClient.rerank()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.rerank([])).rejects.toThrow('Cannot process the query');
            await expect(cohereClient.rerank(123)).rejects.toThrow('Cannot process the query');

            await expect(cohereClient.rerank('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.rerank('test', [])).rejects.toThrow('Cannot process the documents array');
            await expect(cohereClient.rerank('test', 123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.rerank('test', ['test'])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.rerank('test', ['test'], [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.rerank('test', ['test'], 123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'classify' request failure", async () => {
            await expect(cohereClient.classify()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.classify([])).rejects.toThrow('Cannot process the imputs array');
            await expect(cohereClient.classify(123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.classify(['test'])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.classify(['test'], [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.classify(['test'], 123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getDataset' request failure", async () => {
            await expect(cohereClient.getDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getDataset([])).rejects.toThrow('Cannot process the dataset ID');
            await expect(cohereClient.getDataset(123)).rejects.toThrow('Cannot process the dataset ID');
        });
        it("Test when 'createDataset' request failure", async () => {
            await expect(cohereClient.createDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createDataset([])).rejects.toThrow('Cannot process the name');
            await expect(cohereClient.createDataset(123)).rejects.toThrow('Cannot process the name');

            await expect(cohereClient.createDataset('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createDataset('test', [])).rejects.toThrow('Cannot process the file path');
            await expect(cohereClient.createDataset('test', 123)).rejects.toThrow('Cannot process the file path');

            await expect(cohereClient.createDataset('test', 'test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createDataset('test', 'test', [])).rejects.toThrow('Cannot process the type');
            await expect(cohereClient.createDataset('test', 'test', 123)).rejects.toThrow('Cannot process the type');
        });
        it("Test when 'deleteDataset' request failure", async () => {
            await expect(cohereClient.deleteDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteDataset([])).rejects.toThrow('Cannot process the dataset ID');
            await expect(cohereClient.deleteDataset(123)).rejects.toThrow('Cannot process the dataset ID');
        });
        it("Test when 'tokenize' request failure", async () => {
            await expect(cohereClient.tokenize()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.tokenize([])).rejects.toThrow('Cannot process the text');
            await expect(cohereClient.tokenize(123)).rejects.toThrow('Cannot process the text');

            await expect(cohereClient.tokenize('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.tokenize('test', [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.tokenize('test', 123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'detokenize' request failure", async () => {
            await expect(cohereClient.detokenize()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.detokenize([])).rejects.toThrow('Cannot process the tokens array');
            await expect(cohereClient.detokenize(123)).rejects.toThrow('This is not an array');

            await expect(cohereClient.detokenize([123])).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.detokenize([123], [])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.detokenize([123], 123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getModel' request failure", async () => {
            await expect(cohereClient.getModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getModel([])).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.getModel(123)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getConnector' request failure", async () => {
            await expect(cohereClient.getConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getConnector([])).rejects.toThrow('Cannot process the connector ID');
            await expect(cohereClient.getConnector(123)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'createConnector' request failure", async () => {
            await expect(cohereClient.createConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createConnector([])).rejects.toThrow('Cannot process the name');
            await expect(cohereClient.createConnector(123)).rejects.toThrow('Cannot process the name');

            await expect(cohereClient.createConnector('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createConnector('test', [])).rejects.toThrow('Cannot process the url');
            await expect(cohereClient.createConnector('test', 123)).rejects.toThrow('Cannot process the url');
        });
        it("Test when 'updateConnector' request failure", async () => {
            await expect(cohereClient.updateConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.updateConnector([])).rejects.toThrow('Cannot process the connector ID');
            await expect(cohereClient.updateConnector(123)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'authorizeConnector' request failure", async () => {
            await expect(cohereClient.authorizeConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.authorizeConnector([])).rejects.toThrow('Cannot process the connector ID');
            await expect(cohereClient.authorizeConnector(123)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'deleteConnector' request failure", async () => {
            await expect(cohereClient.deleteConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteConnector([])).rejects.toThrow('Cannot process the connector ID');
            await expect(cohereClient.deleteConnector(123)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'getFineTunedModel' request failure", async () => {
            await expect(cohereClient.getFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedModel([])).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.getFineTunedModel(123)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'getFineTunedModelChronology' request failure", async () => {
            await expect(cohereClient.getFineTunedModelChronology()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedModelChronology([])).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.getFineTunedModelChronology(123)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'getFineTunedModelMetrics' request failure", async () => {
            await expect(cohereClient.getFineTunedModelMetrics()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedModelMetrics([])).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.getFineTunedModelMetrics(123)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'createFineTunedModel' request failure", async () => {
            await expect(cohereClient.createFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createFineTunedModel([])).rejects.toThrow('Cannot process the fine-tuned model name');
            await expect(cohereClient.createFineTunedModel(123)).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it("Test when 'updateFineTunedModel' request failure", async () => {
            await expect(cohereClient.updateFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.updateFineTunedModel([])).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.updateFineTunedModel(123)).rejects.toThrow('Cannot process the fine-tuned model ID');

            await expect(cohereClient.updateFineTunedModel('test')).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.updateFineTunedModel('test', [])).rejects.toThrow('Cannot process the fine-tuned model name');
            await expect(cohereClient.updateFineTunedModel('test', 123)).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it("Test when 'deleteFineTunedModel' request failure", async () => {
            await expect(cohereClient.deleteFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteFineTunedModel([])).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.deleteFineTunedModel(123)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
    });
});