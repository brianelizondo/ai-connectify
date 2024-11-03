export = ChatGPTClient;
/**
* Represents a service for interacting with the ChatGPT API
* @class
*/
declare class ChatGPTClient {
    /**
    * Create a ChatGPT service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey: string);
    aiName: string;
    aiApiKey: string;
    organizationIDs: {};
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
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    * @throws {AIConnectifyError} Throws an error if the provided organization ID is invalid
    */
    setOrganizationId(organizationID: string): void;
    /**
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The project ID for OpenAI instance
    * @throws {AIConnectifyError} Throws an error if the provided project ID is invalid
    */
    setProjectId(projectID: string): void;
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    private throwError;
}
import HttpClient = require("../../HttpClient/HttpClient");
