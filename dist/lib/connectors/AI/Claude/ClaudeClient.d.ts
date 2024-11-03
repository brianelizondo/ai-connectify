export = ClaudeClient;
/**
* Represents a service for interacting with the Claude API
* @class
*/
declare class ClaudeClient {
    /**
    * Create a Claude service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey: string);
    aiName: string;
    aiApiKey: string;
    anthropicVersion: string;
    httpRequest: HttpClient;
    /**
    * Loads all available methods from the 'methods' directory
    * and assigns them to the current instance
    * @private
    */
    private _loadMethods;
    /**
    * Create a new HttpClient instance using the class constructor params
    * @private
    * @returns {HttpClient} A new HttpClient instance
    */
    private _createHttpClient;
    /**
    * Set the anthropic-version request header
    * @param {string} version - The anthropic-version request header
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setAnthropicVersion(version: string): void;
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    private throwError;
}
import HttpClient = require("../../HttpClient/HttpClient");
