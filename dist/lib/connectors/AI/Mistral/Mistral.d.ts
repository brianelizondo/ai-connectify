export = Mistral;
/**
* Represents a Mistral AI instance
* Handles interaction with the Mistral API for multilingual, code generation, maths, and advanced reasoning capabilities.
* @exports Mistral
* @class
*/
declare class Mistral {
    /**
    * Create a Mistral instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey: string);
    client: MistralClient;
    /** MODELS METHODS **/
    /**
    * List all models available to the user
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModels(): Promise<any[]>;
    /**
    * Retrieve a model information
    * @async
    * @param {string} modelID - The ID of the model to use for this request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModel(modelID: string): Promise<Object>;
    /** CHAT METHODS **/
    /**
    * Chat Completion API
    * @async
    * @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
    * @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    createChatCompletion(messagesArray: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** FIM METHODS **/
    /**
    * Fill-in-the-middle API
    * @async
    * @param {String} prompt - The text/code to complete
    * @param {string} [modelID="codestral-2405"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    fimCompletion(prompt: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** AGENTS METHODS **/
    /**
    * Agents API
    * @async
    * @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
    * @param {string} agentID - The ID of the agent to use for this completion
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    agentsCompletion(messagesArray: any[], agentID: string, newConfig?: Object | undefined): Promise<Object>;
    /** EMBEDDINGS METHODS **/
    /**
    * Embeddings API
    * @async
    * @param {string|Array} input - Input (string) or Array of Input (strings) (Input)
    * @param {string} modelID - The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    embeddings(input: string | any[], modelID: string, newConfig?: Object | undefined): Promise<Object>;
    /** FINE-TUNING JOBS METHODS **/
    /**
    * Get a list of fine-tuning jobs for your organization and user
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJobs(newConfig?: Object | undefined): Promise<Object>;
    /**
    * Get a fine-tuned job details by its UUID
    * @async
    * @param {string} fine_tuning_job_id - The ID of the job to analyse
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJob(fine_tuning_job_id: string): Promise<Object>;
    /**
    * Creates a fine-tuning job which begins the process of creating a new model from a given dataset
    * @async
    * @param {Object} hyperparameters - The fine-tuning hyperparameter settings used in a fine-tune job
    * @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createFineTuningJob(hyperparameters: Object, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Request the start of a validated fine tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the job to analyse
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    startFineTuningJob(fine_tuning_job_id: string): Promise<Object>;
    /**
    * Request the cancellation of a fine tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    cancelFineTuningJob(fine_tuning_job_id: string): Promise<Object>;
    /** FINE-TUNED MODELS METHODS */
    /**
    * Update a model name or description
    * @async
    * @param {string} fine_tuning_model_id - The ID of the model to update
    * @param {Object} [newConfig={}] - (Optional) Name and description to update the model
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    updateFineTuningModel(fine_tuning_model_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Archive a fine-tuned model
    * @async
    * @param {string} fine_tuning_model_id - The ID of the job to archive
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    archiveFineTuningModel(fine_tuning_model_id: string): Promise<Object>;
    /**
    * Unarchive a fine-tuned model
    * @async
    * @param {string} fine_tuning_model_id - The ID of the job to unarchive
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    unarchiveFineTuningModel(fine_tuning_model_id: string): Promise<Object>;
    /**
    * Delete a fine-tuned model
    * @async
    * @param {string} fine_tuning_model_id - The ID of the model to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    deleteFineTuningModel(fine_tuning_model_id: string): Promise<Object>;
}
import MistralClient = require("./MistralClient");
