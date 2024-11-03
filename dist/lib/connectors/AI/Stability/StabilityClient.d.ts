export = StabilityClient;
/**
* Represents a service for interacting with the Stability API
* @class
*/
declare class StabilityClient {
    /**
    * Create a Stability service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey: string);
    aiName: string;
    aiApiKey: string;
    clientData: {};
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
    * Set the name of your application
    * @param {string} clientID - The client ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientId(clientID: string): void;
    /**
    * Set an unique identifier for your end user
    * @param {string} userID - The user ID for Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientUserId(userID: string): void;
    /**
    * Set the version of your application
    * @param {string} clientVersion - The version of your application in Stability instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setClientVersion(clientVersion: string): void;
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @private
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    private throwError;
}
import HttpClient = require("../../HttpClient/HttpClient");
