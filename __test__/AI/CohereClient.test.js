import fs from 'fs';
import FormData from 'form-data';
import CohereClient from '../../lib/connectors/AI/Cohere/CohereClient';
import HttpClient from '../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../lib/AIConnectifyError';

jest.mock('../../lib/connectors/HttpClient/HttpClient');
jest.mock('fs');

describe("Cohere class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    const mockTestUrl = "https://api.cohere.com/v2";
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
                Authorization: `Bearer ${mockApiKey}`,
            });
        });
    });

    describe("Use each method individually", () => {
        describe("Client and API Key methods", () => {
            it("Test call 'setClientName' method", () => {
                const clientName = 'test-client';
                cohereClient.setClientName(clientName);
                expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                        Authorization: `Bearer ${mockApiKey}`,
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
            const modelId = 'test-model';
            const config = { temperature: 0.7 };
    
            it("Test call 'chat' method", async () => {
                const messages = [{ role: "user", message: "Hello world!"}];
                const mockResponse = { id: 'id-response', message: 'Hello there!' };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.chat(messages, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/chat', {
                        ...config,
                        messages,
                        stream: false,
                        model: modelId
                });
            });
        });

        describe("Embed methods", () => {
            const modelId = 'embed-model';
            const config = { truncate: 'END' };

            it("Test call 'embed' method", async () => {
                const texts = ['text1', 'text2'];
                const mockResponse = { embeddings: [[0.1, 0.2], [0.3, 0.4]] };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.embed(texts, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/embed', {
                    ...config,
                    texts, 
                    model: modelId
                });
            });
            it("Test call 'getEmbedJobs' method", async () => {
                const mockResponse = { embed_jobs: [{ job_id: 'job_id_1' }, { job_id: 'job_id_2' }]};
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getEmbedJobs();
                expect(result).toEqual(mockResponse.embed_jobs);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/embed-jobs');
            });
            it("Test call 'getEmbedJob' method", async () => {
                const jobId = 'job_id_1';
                const mockResponse = { job_id: jobId, status: 'completed' };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getEmbedJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/embed-jobs/${jobId}`);
            });
            it("Test call 'createEmbedJob' method", async () => {
                const dataset_id = 'my-dataset';
                const input_type = 'search_query';
                const mockResponse = 'new_job_id';
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.createEmbedJob(dataset_id, modelId, input_type, config);
                expect(result).toEqual(mockResponse.job_id);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/embed-jobs', { 
                    ...config, 
                    model: modelId, 
                    dataset_id, 
                    input_type 
                });
            });
            it("Test call 'cancelEmbedJob' method", async () => {
                const jobId = 'job_id_1';
                const mockResponse = { embed_job_id: jobId, status: 'canceled' };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.cancelEmbedJob(jobId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith(`/embed-jobs/${jobId}/cancel`);
            });
        });

        describe("Rerank methods", () => {
            it("Test call 'rerank' method", async () => {
                const query = 'query message string';
                const documents = ['document text 1', 'document text 2', 'document text 3'];
                const modelId = 'test-model';
                const config = { return_documents: true };
                const mockResponse = { results: { index: 0, relevance_score: 0.32713068 }};
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.rerank(query, documents, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/rerank', { 
                    ...config, 
                    query, 
                    documents, 
                    model: modelId 
                });
            });
        });

        describe("Classify methods", () => {
            it("Test call 'classify' method", async () => {
                const inputs = ['document text 1', 'document text 2', 'document text 3'];
                const examples = [{text: 'document text 1'}, {text: 'document text 2'}, {text: 'document text 3'}];
                const modelId = 'test-model';
                const config = { truncate: 'END' };
                const mockResponse = { classifications: [{ id: 'id', prediction: ["No spam"] }]};
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.classify(inputs, examples, modelId, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/classify', { 
                    ...config, 
                    inputs, 
                    examples, 
                    model: modelId 
                });
            });
        });

        describe("Dataset methods", () => {
            it("Test call 'getDatasets' method", async () => {
                const config = { limit: 1.5 }
                const mockResponse = [{ id: 'dataset_1' }, { id: 'dataset_2' }];
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDatasets(config);
                expect(result).toEqual(mockResponse.datasets);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/datasets', config);
            });
            it("Test call 'getDataset' method", async () => {
                const datasetId = 'dataset-id';
                const mockResponse = { id: 'dataset-id', name: 'dataset_name' };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDataset(datasetId);
                expect(result).toEqual(mockResponse.dataset);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/datasets/${datasetId}`);
            });
            it("Test call 'getDatasetUsage' method", async () => {
                const mockResponse = { "organization_usage": 1000000 };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getDatasetUsage();
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/datasets/usage');
            });
            it("Test call 'createDataset' method", async () => {
                const name = 'test-dataset';
                const type = 'embed-input';
                const filePath = '/path/to/file';
                const config = { keep_original_file: true };
                const mockResponse = { id: 'new-dataset-id' };
                const mockFileStream = 'mock-file-stream';
                
                fs.createReadStream.mockReturnValue(mockFileStream);
                mockHttpClient.post.mockResolvedValue(mockResponse);
                const appendSpy = jest.spyOn(FormData.prototype, 'append');
                const getHeadersSpy = jest.spyOn(FormData.prototype, 'getHeaders').mockReturnValue({ 'content-type': 'multipart/form-data' });
                
                const result = await cohereClient.createDataset(name, filePath, type, config);
                
                expect(result).toEqual({ dataset_id: mockResponse.id });
                expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
                expect(appendSpy).toHaveBeenCalledWith('data', mockFileStream);
                expect(appendSpy).toHaveBeenCalledWith('name', name);
                expect(appendSpy).toHaveBeenCalledWith('type', type);
                expect(appendSpy).toHaveBeenCalledWith('keep_original_file', true);
                expect(getHeadersSpy).toHaveBeenCalled();
                expect(mockHttpClient.post).toHaveBeenCalledWith('/datasets',
                    expect.any(FormData),
                    expect.objectContaining({ headers: expect.any(Object) })
                );

                appendSpy.mockRestore();
                getHeadersSpy.mockRestore();
            });
            it("Test call 'deleteDataset' method", async () => {
                const datasetId = 'dataset-id';
                const mockResponse = { dataset_id: datasetId, status: 'deleted' };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await cohereClient.deleteDataset(datasetId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/datasets/${datasetId}`);
            });
        });

        describe("Token Methods", () => {
            const modelId = 'test-model';

            it("Test call 'tokenize' method", async () => {
                const text = "tokenize"
                const mockResponse = { tokens: [1,2,3] };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.tokenize(text, modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/tokenize', { text, model: modelId });
            });
            it("Test call 'detokenize' method", async () => {
                const tokens = [1,2,3];
                const mockResponse = { text: "tokenize" };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.detokenize(tokens, modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/detokenize', { tokens, model: modelId });
            });
        });

        describe("Models Methods", () => {
            it("Test call 'getModels' method", async () => {
                const config = { default_only: true };
                const mockResponse = { models: [{ name: 'model_name_1' }, { name: 'model_name_2' }]};
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.getModels(config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/models', config);
            });
            it("Test call 'getModel' method with the correct modelID", async () => {
                const modelId = 'test-model';
                const mockResponse = { id: modelId, name: 'Test Model' };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
                
                const result = await cohereClient.getModel(modelId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/models/${modelId}`);
            });
        });

        describe("Connector methods", () => {
            it("Test call 'getConnectors' method", async () => {
                const config = { limit: 1.5 };
                const mockResponse = { connectors: [{ id: 'connector_1', name: 'connector_name' }]};
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getConnectors(config);
                expect(result).toEqual(mockResponse.connectors);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/connectors', config);
            });
            it("Test call 'getConnector' method", async () => {
                const connectorId = 'connector-id';
                const mockResponse = { id: 'connector-id' };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);

                const result = await cohereClient.getConnector(connectorId);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/connectors/${connectorId}`);
            });
            it("Test call 'createConnector' method", async () => {
                const name = 'test-connector';
                const url = 'http://test.com';
                const config = { description: 'connector description' };
                const mockResponse = { id: 'new-connector-id', name, url };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await cohereClient.createConnector(name, url, config);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/connectors', { ...config, name, url });
            });
            it("Test call 'updateConnector' method", async () => {
                const connectorId = 'connector-id';
                const config = { url: 'http://newurl.com' };
                const mockResponse = { id: 'connector-id', updated_at: "updated-date" };
                cohereClient.httpRequest.patch.mockResolvedValue(mockResponse);

                const result = await cohereClient.updateConnector(connectorId, config);
                expect(result).toEqual(mockResponse.connector);
                expect(cohereClient.httpRequest.patch).toHaveBeenCalledWith(`/connectors/${connectorId}`, config);
            });
            it("Test call 'deleteConnector' method", async () => {
                const connectorId = 'connector-id';
                const mockResponse = { connector_id: connectorId, status: 'deleted' };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);

                const result = await cohereClient.deleteConnector(connectorId);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/connectors/${connectorId}`);
            });
        });

        describe("Fine-tuned methods", () => {
            it("Test call 'getFineTunedModels' method", async () => {
                const config = { page_size: 5 };
                const mockResponse = { finetuned_models: [{ id: 'ft-id', name: 'ft-name', status: 'STATUS_READY' }] };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModels(config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith('/finetuning/finetuned-models', config);
            });
            it("Test call 'getFineTunedModel' method", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const mockResponse = { id: finetuned_model_id, name: 'finetuned-model-name' };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/finetuning/finetuned-models/${finetuned_model_id}`);
            });
            it("Test call 'getFineTunedChronology' method", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const config = { page_size: 5 };
                const mockResponse = { events: [{ user_id: 'user-id', status: 'STATUS_QUEUED' }] };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedChronology(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/finetuning/finetuned-models/${finetuned_model_id}/events`, config);
            });
            it("Test call 'getFineTunedMetrics' method", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const config = { page_size: 5 };
                const mockResponse = { step_metrics: [{ step_number: 1, created_at: 'created-date' }] };
                cohereClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.getFineTunedMetrics(finetuned_model_id, config);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.get).toHaveBeenCalledWith(`/finetuning/finetuned-models/${finetuned_model_id}/training-step-metrics`, config);
            });
            it("Test call 'createFineTunedModel' method", async () => {
                const name = 'finetuned-model-name';
                const settings = { base_model: { base_type: "BASE_TYPE_CHAT" }, dataset_id: "test-dataset-id" };
                const config = { creator_id: 'creator-id' };
                const mockResponse = { name, settings, id: 'new-finetuned-model-id' };
                cohereClient.httpRequest.post.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.createFineTunedModel(name, settings, config);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.post).toHaveBeenCalledWith('/finetuning/finetuned-models', { ...config, name, settings });
            });
            it("Test call 'updateFineTunedModel' method", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const name = 'new-finetuned-model-name';
                const settings = { base_model: { base_type: "BASE_TYPE_CHAT" }, dataset_id: "test-dataset-id" };
                const config = { creator_id: 'creator-id' };
                const mockResponse = { name, settings, id: 'new-finetuned-model-id' };
                cohereClient.httpRequest.patch.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.updateFineTunedModel(finetuned_model_id, name, settings, config);
                expect(result).toEqual(mockResponse.finetuned_model);
                expect(cohereClient.httpRequest.patch).toHaveBeenCalledWith(`/finetuning/finetuned-models/${finetuned_model_id}`, { ...config, name, settings });
            });
            it("Test call 'deleteFineTunedModel' method", async () => {
                const finetuned_model_id = 'finetuned-model-id';
                const mockResponse = { finetuned_model_id: finetuned_model_id, status: 'deleted' };
                cohereClient.httpRequest.delete.mockResolvedValue(mockResponse);
    
                const result = await cohereClient.deleteFineTunedModel(finetuned_model_id);
                expect(result).toEqual(mockResponse);
                expect(cohereClient.httpRequest.delete).toHaveBeenCalledWith(`/finetuning/finetuned-models/${finetuned_model_id}`);
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
            await expect(cohereClient.chat(12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.chat(['test','test'], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'chatWithStreaming' request failure", async () => {
            await expect(cohereClient.chatWithStreaming()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.chatWithStreaming(12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.chatWithStreaming(['test','test'], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'embed' request failure", async () => {
            await expect(cohereClient.embed()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.embed(12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.embed(['test','test'], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getEmbedJob' request failure", async () => {
            await expect(cohereClient.getEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getEmbedJob(['test','test'], 12345)).rejects.toThrow('Cannot process the embed job ID');
        });
        it("Test when 'createEmbedJob' request failure", async () => {
            await expect(cohereClient.createEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createEmbedJob(12345)).rejects.toThrow('Cannot process the dataset ID');
            await expect(cohereClient.createEmbedJob('test', 12345)).rejects.toThrow('Cannot process the model ID');
            await expect(cohereClient.createEmbedJob('test', 'test', 12345)).rejects.toThrow('Cannot process the input type');
        });
        it("Test when 'cancelEmbedJob' request failure", async () => {
            await expect(cohereClient.cancelEmbedJob()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.cancelEmbedJob(12345)).rejects.toThrow('Cannot process the embed job ID');
        });
        it("Test when 'rerank' request failure", async () => {
            await expect(cohereClient.rerank()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.rerank(12345)).rejects.toThrow('Cannot process the message');
            await expect(cohereClient.rerank('test', 12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.rerank('test', [1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'classify' request failure", async () => {
            await expect(cohereClient.classify()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.classify(12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.classify([1,2,3], 'test-examples')).rejects.toThrow('This is not an array');
        });
        it("Test when 'getDataset' request failure", async () => {
            await expect(cohereClient.getDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getDataset(12345)).rejects.toThrow('Cannot process the dataset ID');
        });
        it("Test when 'createDataset' request failure", async () => {
            await expect(cohereClient.createDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createDataset(12345)).rejects.toThrow('Cannot process the name');
            await expect(cohereClient.createDataset('test', 12345)).rejects.toThrow('Cannot process the file path');
            await expect(cohereClient.createDataset('test', 'test', 12345)).rejects.toThrow('Cannot process the type');
        });
        it("Test when 'deleteDataset' request failure", async () => {
            await expect(cohereClient.deleteDataset()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteDataset(12345)).rejects.toThrow('Cannot process the dataset ID');
        });
        it("Test when 'tokenize' request failure", async () => {
            await expect(cohereClient.tokenize()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.tokenize(12345)).rejects.toThrow('Cannot process the text');
            await expect(cohereClient.tokenize('test', 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'detokenize' request failure", async () => {
            await expect(cohereClient.detokenize()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.detokenize(12345)).rejects.toThrow('This is not an array');
            await expect(cohereClient.detokenize([1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getModel' request failure", async () => {
            await expect(cohereClient.getModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getModel(12345)).rejects.toThrow('Cannot process the model ID');
        });
        it("Test when 'getConnector' request failure", async () => {
            await expect(cohereClient.getConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getConnector(12345)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'createConnector' request failure", async () => {
            await expect(cohereClient.createConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createConnector(12345)).rejects.toThrow('Cannot process the name');
            await expect(cohereClient.createConnector('test', 12345)).rejects.toThrow('Cannot process the url');
        });
        it("Test when 'updateConnector' request failure", async () => {
            await expect(cohereClient.updateConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.updateConnector(12345)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'deleteConnector' request failure", async () => {
            await expect(cohereClient.deleteConnector()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteConnector(12345)).rejects.toThrow('Cannot process the connector ID');
        });
        it("Test when 'getFineTunedModel' request failure", async () => {
            await expect(cohereClient.getFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedModel(12345)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'getFineTunedChronology' request failure", async () => {
            await expect(cohereClient.getFineTunedChronology()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedChronology(12345)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'getFineTunedMetrics' request failure", async () => {
            await expect(cohereClient.getFineTunedMetrics()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.getFineTunedMetrics(12345)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
        it("Test when 'createFineTunedModel' request failure", async () => {
            await expect(cohereClient.createFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.createFineTunedModel(12345)).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it("Test when 'updateFineTunedModel' request failure", async () => {
            await expect(cohereClient.updateFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.updateFineTunedModel(12345)).rejects.toThrow('Cannot process the fine-tuned model ID');
            await expect(cohereClient.updateFineTunedModel('test', 12345)).rejects.toThrow('Cannot process the fine-tuned model name');
        });
        it("Test when 'deleteFineTunedModel' request failure", async () => {
            await expect(cohereClient.deleteFineTunedModel()).rejects.toThrow(AIConnectifyError);
            await expect(cohereClient.deleteFineTunedModel(12345)).rejects.toThrow('Cannot process the fine-tuned model ID');
        });
    });
});