import AIConnectifyError from '../../../lib/AIConnectifyError';
import Claude from '../../../lib/connectors/AI/Claude/Claude';
import ClaudeClient from '../../../lib/connectors/AI/Claude/ClaudeClient';

jest.mock('../../../lib/connectors/AI/Claude/ClaudeClient');

describe("Claude class", () => { 
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let claude;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setAnthropicVersion: jest.fn(),
            cancelMessageBatch: jest.fn(),
            createMessage: jest.fn(),
            createMessageBatch: jest.fn(),
            createMessageStream: jest.fn(),
            getMessageBatch: jest.fn(),
            getMessageBatchList: jest.fn(),
            getMessageBatchResults: jest.fn()
        };
        ClaudeClient.mockImplementation(() => mockClientInstance);
        claude = new Claude(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(claude).toBeInstanceOf(Claude);
            expect(ClaudeClient).toHaveBeenCalledWith(mockApiKey);
        });
    });
    
    describe("Use each method individually", () => {
        describe("Anthropic version Methods", () => {
            it("Test call 'setAnthropicVersion' on the client instance", () => {
                const versionId = 'test-version-id';
                claude.setAnthropicVersion(versionId);
                expect(mockClientInstance.setAnthropicVersion).toHaveBeenCalledWith(versionId);
            });
        });

        describe("Messages Methods", () => {
            it("Test call 'createMessage' on the client instance", async () => {
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
                mockClientInstance.createMessage.mockResolvedValue(mockResponse);
                
                const result = await claude.createMessage(messagesArray, modelId, maxTokens, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createMessage).toHaveBeenCalled();
            });

            it("Test call 'createMessageStream' on the client instance", async () => {
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
                mockClientInstance.createMessageStream.mockResolvedValue(mockResponse);
                
                const result = await claude.createMessageStream(messagesArray, modelId, maxTokens, config);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createMessageStream).toHaveBeenCalled();
            });
        });

        describe("Message Batch Methods", () => {
            it("Test call 'cancelMessageBatch' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';

                const mockResponse = { id: messageBatchId, type: "message_batch" };
                mockClientInstance.cancelMessageBatch.mockResolvedValue(mockResponse);
                
                const result = await claude.cancelMessageBatch(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.cancelMessageBatch).toHaveBeenCalled();
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
                mockClientInstance.createMessageBatch.mockResolvedValue(mockResponse);
                
                const result = await claude.createMessageBatch(requests);
                expect(result).toEqual(mockResponse);
                expect(mockClientInstance.createMessageBatch).toHaveBeenCalled();
            });

            it("Test call 'getMessageBatch' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';
                const mockResponse = { 
                    id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                    type: "message_batch",
                    processing_status: "in_progress"
                };
                
                claude.client.getMessageBatch.mockResolvedValue(mockResponse);
    
                const result = await claude.getMessageBatch(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(claude.client.getMessageBatch).toHaveBeenCalledWith(messageBatchId);
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
                
                claude.client.getMessageBatchList.mockResolvedValue(mockResponse);
    
                const result = await claude.getMessageBatchList(config);
                expect(result).toEqual(mockResponse);
                expect(claude.client.getMessageBatchList).toHaveBeenCalledWith(config);
            });

            it("Test call 'getMessageBatchResults' on the client instance", async () => {
                const messageBatchId = 'message-batch-id-16-characters';
                const mockResponse = {
                    id: "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
                    type: "message_batch",
                    processing_status: "in_progress"
                };
                
                claude.client.getMessageBatchResults.mockResolvedValue(mockResponse);
    
                const result = await claude.getMessageBatchResults(messageBatchId);
                expect(result).toEqual(mockResponse);
                expect(claude.client.getMessageBatchResults).toHaveBeenCalledWith(messageBatchId);
            });
        });
    });
    
    
    describe("Throw the AIConnectifyError error", () => {
         it("Tests when API key is not provided", () => {
            expect(() => new Claude()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new Claude('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });
});