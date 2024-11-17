import ClaudeClient from '../../../lib/connectors/AI/Claude/ClaudeClient'
import HttpClient from '../../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../../lib/AIConnectifyError';

jest.mock('../../../lib/connectors/HttpClient/HttpClient');

describe("ClaudeClient class", () => {
    const mockApiKey = "TEST_API_KEY_WITH_16_CHARACTERS";
    const mockApiVersion = "2023-06-01";
    const mockTestUrl = "https://api.anthropic.com/v1";
    let claudeClient;
    let mockHttpClient;
  
    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            throwError: jest.fn()
        };
        HttpClient.mockImplementation(() => mockHttpClient);
        claudeClient = new ClaudeClient(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(claudeClient).toBeInstanceOf(ClaudeClient);
            expect(claudeClient.aiName).toBe('Claude');
            expect(claudeClient.aiApiKey).toBe(mockApiKey);
            expect(HttpClient).toHaveBeenCalledWith(mockTestUrl, {
                'x-api-key': mockApiKey, 
                'anthropic-version': mockApiVersion
            });
        });
    });

    describe("Use the Anthropic version Methods", () => {
        it("Test call 'setAnthropicVersion' method", () => {
            const versionId = 'test-version-id';
            claudeClient.setAnthropicVersion(versionId);
            expect(HttpClient).toHaveBeenCalledTimes(2);
            expect(claudeClient.anthropicVersion).toBe(versionId);
        });
    });

    describe("Use each method individually", () => {
        describe("Messages Methods", () => {
            const messagesArray = [
                {"role": "user", "content": "Hello, world"}
            ];
            const modelId = 'model-test-id';
            const maxTokens = 1024;
            const config = { temperature: 0.7 };

            const mockResponse = { 
                "content": [{
                        text: "Hi! My name is Claude.",
                        type: "text"
                    }
                ],
                id: "msg_013Zva2CMHLNnXjNJJKqJ2EF",
                model: "claude-3-5-sonnet-20241022",
                role: "assistant"
            };   
            
            it("Test call 'createMessage' on the client instance", async () => {
                claudeClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await claudeClient.createMessage(messagesArray, modelId, maxTokens, config);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.post).toHaveBeenCalledWith(
                    '/messages', 
                    expect.objectContaining({ 
                        ...config, 
                        messages: messagesArray, 
                        model: modelId, 
                        max_tokens: maxTokens 
                    })
                );
            });

            it("Test call 'createMessageStream' on the client instance", async () => {           
                claudeClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await claudeClient.createMessageStream(messagesArray, modelId, maxTokens, config);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.post).toHaveBeenCalledWith(
                    '/messages', 
                    expect.objectContaining({ 
                        ...config, 
                        messages: messagesArray, 
                        model: modelId, 
                        max_tokens: maxTokens,
                        stream: true 
                    })
                );
            });
        });

        describe("Message Batch Methods", () => {
            it("Test call 'cancelMessageBatch' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';

                const mockResponse = { id: messageBatchId, type: "message_batch" };
                claudeClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await claudeClient.cancelMessageBatch(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.post).toHaveBeenCalledWith(
                    `/messages/batches/${messageBatchId}/cancel`, 
                    expect.objectContaining({ 
                        headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                    })
                );
            });
            
            it("Test call 'createMessageBatch' on the client instance", async () => {
                const requests = [
                    {
                        "custom_id": "my-first-request",
                        "params": {
                            "model": "claude-3-5-sonnet-20241022",
                            "max_tokens": 1024,
                            "messages": [
                                {"role": "user", "content": "Hello, world"}
                            ]
                        }
                    }
                ];

                const mockResponse = { 
                    id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                    type: "message_batch",
                    processing_status: "in_progress"
                };
                claudeClient.httpRequest.post.mockResolvedValue(mockResponse);

                const result = await claudeClient.createMessageBatch(requests);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.post).toHaveBeenCalledWith(
                    '/messages/batches', 
                    { requests }, 
                    expect.objectContaining({ 
                        headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                    })
                );
            });

            it("Test call 'getMessageBatch' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';
                const mockResponse = { 
                    id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                    type: "message_batch",
                    processing_status: "in_progress"
                };
                claudeClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await claudeClient.getMessageBatch(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.get).toHaveBeenCalledWith(
                    `/messages/batches/${messageBatchId}`,
                    expect.objectContaining({ 
                        headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                    })
                );
            });

            it("Test call 'getMessageBatchList' on the client instance", async () => {
                const config = { limit: 20 };
                const mockResponse = {
                    "data": [
                        {
                            id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                            type: "message_batch",
                            processing_status: "in_progress",
                            results_url: "https://api.anthropic.com/v1/messages/batches"
                        }
                    ]
                };
                claudeClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await claudeClient.getMessageBatchList(config);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.get).toHaveBeenCalledWith(
                    '/messages/batches', 
                    expect.objectContaining({ 
                        params: { ...config },
                        headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                    })
                );
            });

            it("Test call 'getMessageBatchResults' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';
                const mockResponse = {
                    id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                    type: "message_batch",
                    processing_status: "in_progress"
                };
                claudeClient.httpRequest.get.mockResolvedValue(mockResponse);
    
                const result = await claudeClient.getMessageBatchResults(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(claudeClient.httpRequest.get).toHaveBeenCalledWith(
                    `/messages/batches/${messageBatchId}/results`, 
                    expect.objectContaining({ 
                        headers: { 'anthropic-beta': 'message-batches-2024-09-24' }
                    })
                );
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Test when HttpClient request failure", () => {
            mockHttpClient.get.mockRejectedValue(new Error('API Error'));
            mockHttpClient.post.mockRejectedValue(new Error('API Error'));
        });
        it("Test when Anthropic Version ID is invalid", () => {
            expect(() => claudeClient.setAnthropicVersion('')).toThrow(AIConnectifyError);
            expect(() => claudeClient.setAnthropicVersion(12345)).toThrow(AIConnectifyError);
            expect(() => claudeClient.setAnthropicVersion([])).toThrow(AIConnectifyError);
        });
        it("Test when 'cancelMessageBatch' request failure", async () => {
            await expect(claudeClient.cancelMessageBatch()).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.cancelMessageBatch('')).rejects.toThrow('Cannot process the message batch ID');
            await expect(claudeClient.cancelMessageBatch(12345)).rejects.toThrow('Cannot process the message batch ID');
        });
        it("Test when 'createMessage' request failure", async () => {
            await expect(claudeClient.createMessage()).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessage([])).rejects.toThrow('Cannot process the messages array');
            await expect(claudeClient.createMessage(12345)).rejects.toThrow('This is not an array');

            await expect(claudeClient.createMessage([1,2,3])).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessage([1,2,3], '')).rejects.toThrow('Cannot process the model ID');
            await expect(claudeClient.createMessage([1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');

            await expect(claudeClient.createMessage([1,2,3], 'test-model-id')).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessage([1,2,3], 'test-model-id', '')).rejects.toThrow('Cannot process the max tokens value');
            await expect(claudeClient.createMessage([1,2,3], 'test-model-id', '12345')).rejects.toThrow('Cannot process the max tokens value');
        });
        it("Test when 'createMessageStream' request failure", async () => {
            await expect(claudeClient.createMessageStream()).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessageStream([])).rejects.toThrow('Cannot process the messages array');
            await expect(claudeClient.createMessageStream(12345)).rejects.toThrow('This is not an array');

            await expect(claudeClient.createMessageStream([1,2,3])).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessageStream([1,2,3], '')).rejects.toThrow('Cannot process the model ID');
            await expect(claudeClient.createMessageStream([1,2,3], 12345)).rejects.toThrow('Cannot process the model ID');

            await expect(claudeClient.createMessageStream([1,2,3], 'test-model-id')).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.createMessageStream([1,2,3], 'test-model-id', '')).rejects.toThrow('Cannot process the max tokens value');
            await expect(claudeClient.createMessageStream([1,2,3], 'test-model-id', '12345')).rejects.toThrow('Cannot process the max tokens value');
        });
        it("Test when 'getMessageBatch' request failure", async () => {
            await expect(claudeClient.getMessageBatch()).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.getMessageBatch('')).rejects.toThrow('Cannot process the message batch ID');
            await expect(claudeClient.getMessageBatch(12345)).rejects.toThrow('Cannot process the message batch ID');
        });
        it("Test when 'getMessageBatchResults' request failure", async () => {
            await expect(claudeClient.getMessageBatchResults()).rejects.toThrow(AIConnectifyError);
            await expect(claudeClient.getMessageBatchResults('')).rejects.toThrow('Cannot process the message batch ID');
            await expect(claudeClient.getMessageBatchResults(12345)).rejects.toThrow('Cannot process the message batch ID');
        });
    });
});