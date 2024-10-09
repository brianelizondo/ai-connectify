export = DALLEClient;
/**
* Represents a service for interacting with the DALLE API
* @class DALLEClient
*/
declare class DALLEClient {
    /**
    * Create a DALLE service instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    */
    constructor(apiKey: string);
    aiName: string;
    aiApiKey: string;
    organizationIDs: {};
    httpRequest: HttpClient;
    /**
    * Create a new HttpClient instance using the class constructor params
    */
    createHttpClient(): HttpClient;
    /**
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    */
    setOrganizationId(organizationID: string): void;
    /**
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The project ID for OpenAI instance
    */
    setProjectId(projectID: string): void;
    /**
    * Throw a formatted AIConnectifyError with the AI service and error message
    * @param {Object} error - The error object caught during the request
    * @throws {AIConnectifyError} - Throws an error with a message detailing the AI service and error description
    */
    throwError(error: Object): void;
    /** MODELS METHODS
    /**
    * Lists the currently available models, and provides basic information about each one such as the owner and availability
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModels(): Promise<any[]>;
    /**
    * Retrieves a model instance, providing basic information about the model such as the owner and permissioning
    * @async
    * @param {string} modelID - The ID of the model to use for this request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModel(modelID: string): Promise<Object>;
    /** IMAGES METHODS */
    /**
    * Given a prompt and/or an input image, the model will generate a new image
    * @async
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createImage(prompt: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
    /**
    * Creates an edited or extended image given an original image and a prompt
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to edit
    * @param {string} prompt - A text description of the desired image(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createImageEdit(imagePath: string, prompt: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
    /**
    * Creates a variation of a given image
    * @async
    * @param {string} imagePath - The image PNG file (path - not file name) to use as the basis for the variation(s)
    * @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createImageVariation(imagePath: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
}
import HttpClient = require("../../HttpClient/HttpClient");
