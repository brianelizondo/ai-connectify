export = Claude;
/**
* Represents a Claude AI instance
* Handles interaction with the Claude API for chat, completions, edits, and model information
* @exports Claude
* @class
*/
declare class Claude {
    /**
    * Create a Claude instance
    * @constructor
    * @param {string} apiKey - The API key for Claude
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey: string);
    client: ClaudeClient;
    /**
    * Set the anthropic-version request header
    * @param {string} version - The anthropic-version request header
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setAnthropicVersion(version: string): void;
    /** MESSAGE METHODS **/
    /**
    * Send a structured list of input messages with text
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
    * @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    createMessage(messagesArray: any[], modelID?: string | undefined, maxTokens?: number | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Send a structured list of input messages with text (Streaming)
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
    * @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    createMessageStream(messagesArray: any[], modelID?: string | undefined, maxTokens?: number | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** MESSAGE BATCH METHODS **/
    /**
    * (Beta) The Message Batches API can be used to process multiple Messages API requests at once
    * @async
    * @param {Array} requests - List of requests for prompt completion. Each is an individual request to create a Message
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    createMessageBatch(requests: any[]): Promise<Object>;
    /**
    * (Beta) This endpoint is idempotent and can be used to poll for Message Batch completion
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    getMessageBatch(messageBatchID: string): Promise<Object>;
    /**
    * (Beta) Streams the results of a Message Batch as a .jsonl file
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    getMessageBatchResults(messageBatchID: string): Promise<Object>;
    /**
    * (Beta) List all Message Batches within a Workspace
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    getMessageBatchList(newConfig?: Object | undefined): Promise<Object>;
    /**
    * (Beta) Batches may be canceled any time before processing ends
    * @async
    * @param {String} messageBatchID - ID of the Message Batch
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    cancelMessageBatch(messageBatchID: string): Promise<Object>;
}
import ClaudeClient = require("./ClaudeClient");
