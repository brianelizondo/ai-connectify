export = CohereClient;
/**
* Represents a service for interacting with the Cohere API
* @class
*/
declare class CohereClient {
    /**
    * Create a Cohere service instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere
    */
    constructor(apiKey: string);
    aiName: string;
    aiApiKey: string;
    httpRequest: HttpClient;
    /**
    * Loads all available methods from the 'methods' directory
    * and assigns them to the current instance
    * @private
    */
    private _loadMethods;
    /**
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    * @throws {AIConnectifyError} Throws an error if the provided client name is invalid
    */
    setClientName(clientName: string): void;
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    private throwError;
}
import HttpClient = require("../../HttpClient/HttpClient");
