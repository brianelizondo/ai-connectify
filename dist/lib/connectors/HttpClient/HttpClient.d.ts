export = HttpClient;
/**
* Represents an HTTP client for making API requests using Axios.
* This client is designed to make HTTP requests to a specified base URL
* and includes error handling specific to AI-Connectify.
*
* @class HttpClient
*/
declare class HttpClient {
    /**
    * Create a new HttpClient instance.
    * Initializes the Axios client with a base URL and optional default headers.
    *
    * @constructor
    * @param {string} baseURL - The base URL of the API for making requests.
    * @param {Object} [defaultHeaders={}] - Default headers to include in every request made by this client.
    * @param {number} [timeout=10000] - Optional timeout for each request in milliseconds (default is 10 seconds).
    */
    constructor(baseURL: string, defaultHeaders?: Object | undefined, timeout?: number | undefined);
    client: any;
    /**
    * Throw a formatted AIConnectifyError with the request method and error message.
    * @param {string} requestMethod - The HTTP method used (e.g., 'GET', 'POST').
    * @param {Object} error - The error object caught during the request.
    * @throws {AIConnectifyError} - Throws an error with a message detailing the HTTP method and error description.
    */
    throwError(requestMethod: string, error: Object): void;
    /**
    * Send an HTTP GET request to the specified endpoint with optional query parameters.
    * @async
    * @param {string} endpoint - The API endpoint to which the GET request will be sent (relative to the baseURL).
    * @param {Object} [params={}] - Optional query parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    * @throws {AIConnectifyError} - Throws an error if the request fails, including the error message from the server if available.
    */
    get(endpoint: string, params?: Object | undefined): Promise<Object>;
    /**
    * Send an HTTP POST request to the specified endpoint with a JSON body.
    * @async
    * @param {string} endpoint - The API endpoint to which the POST request will be sent (relative to the baseURL).
    * @param {Object} body - The JSON body to send in the POST request.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    * @throws {AIConnectifyError} - Throws an error if the request fails, including the error message from the server if available.
    */
    post(endpoint: string, body: Object): Promise<Object>;
    /**
    * Send an HTTP DELETE request to the specified endpoint
    * @async
    * @param {string} endpoint - The API endpoint to which the POST request will be sent (relative to the baseURL).
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    * @throws {AIConnectifyError} - Throws an error if the request fails, including the error message from the server if available.
    */
    delete(endpoint: string): Promise<Object>;
}
