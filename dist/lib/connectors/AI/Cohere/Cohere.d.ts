export = Cohere;
/**
* Represents a Cohere AI instance
* Given a prompt, the model   builds natural language processing and generation
* @class Cohere
*/
declare class Cohere {
    /**
    * Create a Cohere instance
    * @constructor
    * @param {string} apiKey - The API key for Cohere API
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey: string);
    client: CohereClient;
    /**
    * Set the name of the project that is making the request
    * @param {string} clientName - Project name that is making the request
    */
    setClientName(clientName: string): void;
    /** CHECK API KEY METHOD **/
    /**
    * Checks that the api key in the Authorization header is valid and active
    * @async
    * @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    checkApiKey(): Promise<Object>;
    /** CHAT METHODS **/
    /**
    * Generates a text response to a user message
    * @async
    * @param {Array} messages - Array of text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    chat(messages: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Generates a text response to a user message with streaming (stream of events)
    * @async
    * @param {Array} messages - Array of text input for the model to respond to
    * @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    chatWithStreaming(messages: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** EMBED METHODS **/
    /**
    * Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
    * @async
    * @param {string} texts - An array of strings for the model to embed
    * @param {string} [modelID="embed-english-v2.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    embed(texts: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Generates a list embed job endpoint allows users to view all embed jobs history for that specific user
    * @async
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getEmbedJobs(): Promise<any[]>;
    /**
    * Retrieves the details about an embed job started by the same user
    * @async
    * @param {string} embed_job_id - The ID of the embed job to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getEmbedJob(embed_job_id: string): Promise<Object>;
    /**
    * Launches an async Embed job for a Dataset of type embed-input
    * @async
    * @param {string} dataset_id - ID of a Dataset. The Dataset must be of type embed-input
    * @param {string} [modelID="embed-english-light-v3.0"] - (Optional) The ID of the model to use
    * @param {string} [input_type="classification"] - (Optional) Specifies the type of input passed to the model
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createEmbedJob(dataset_id: string, modelID?: string | undefined, input_type?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Allows to cancel an active embed job
    * @async
    * @param {string} embed_job_id - The ID of the embed job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    cancelEmbedJob(embed_job_id: string): Promise<Object>;
    /** RERANK METHODS **/
    /**
    * Takes in a query and a list of texts and produces an ordered array with each text assigned a relevance score
    * @async
    * @param {string} query - The search query
    * @param {Array} documents - Array of document objects or strings to rerank
    * @param {string} [modelID="rerank-english-v3.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    rerank(query: string, documents: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** CLASSIFY METHODS
    *
    * classify
    * Makes a prediction about which label fits the specified text inputs best
    * @async
    * @param {Array} inputs - A list of up to 96 texts to be classified
    * @param {Array} [examples=[]] - (Optional) An array of examples to provide context to the model. Each example is a text string and its associated label/class
    * @param {string} [modelID="embed-english-light-v2.0"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    classify(inputs: any[], examples?: any[] | undefined, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** DATASETS METHODS **/
    /**
    * Generates a list datasets that have been created
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getDatasets(newConfig?: Object | undefined): Promise<any[]>;
    /**
    * Retrieve a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getDataset(dataset_id: string): Promise<Object>;
    /**
    * Retrieves the dataset storage usage for your Organization
    * @async
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getDatasetUsage(): Promise<Object>;
    /**
    * Create a dataset by uploading a file
    * @async
    * @param {string} name - The name of the uploaded dataset
    * @param {string} filePath - File to create the dataset
    * @param {string} [type="embed-input"] - (Optional) The dataset type, which is used to validate the data
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createDataset(name: string, filePath: string, type?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Delete a dataset by ID
    * @async
    * @param {string} dataset_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    deleteDataset(dataset_id: string): Promise<Object>;
    /** TOKEN METHODS **/
    /**
    * Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE)
    * @async
    * @param {string} text The string to be tokenized
    * @param {string} [modelID="command"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    tokenize(text: string, modelID?: string | undefined): Promise<Object>;
    /**
    * Takes tokens using byte-pair encoding and returns their text representation
    * @async
    * @param {Array} tokens The string to be tokenized
    * @param {string} [modelID="command"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    detokenize(tokens: any[], modelID?: string | undefined): Promise<Object>;
    /** MODELS METHODS **/
    /**
    * List of models available for use. The list contains models from Cohere as well as your fine-tuned models
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModels(newConfig?: Object | undefined): Promise<Object>;
    /**
    * Returns the details of a model, provided its name
    * @async
    * @param {string} modelID - The ID of the model to retrieve
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getModel(modelID: string): Promise<Object>;
    /** CONNECTORS METHODS **/
    /**
    * Returns a list of connectors ordered by descending creation date (newer first)
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getConnectors(newConfig?: Object | undefined): Promise<any[]>;
    /**
    * Retrieve a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to retrieve.
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getConnector(connector_id: string): Promise<Object>;
    /**
    * Creates a new connector
    * @async
    * @param {string} name - A human-readable name for the connector
    * @param {string} url - The URL of the connector that will be used to search for documents
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createConnector(name: string, url: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Update a connector by ID
    * @async
    * @param {string} connector_id - The ID of the connector to update
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    updateConnector(connector_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Delete a connector by ID
    * @async
    * @param {string} connector_id - The ID of the dataset to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    deleteConnector(connector_id: string): Promise<Object>;
    /** FINE-TUNING METHODS **/
    /**
    * Returns a list of fine-tuned models available for use
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTunedModels(newConfig?: Object | undefined): Promise<Object>;
    /**
    * Retrieve a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The fine-tuned model ID
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTunedModel(finetuned_model_id: string): Promise<Object>;
    /**
    * Retrieves the chronology of statuses the fine-tuned model has been through
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTunedChronology(finetuned_model_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Retrieves metrics measured during the training of a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The parent fine-tuned model ID
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTunedMetrics(finetuned_model_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Trains and deploys a fine-tuned model
    * @async
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    createFineTunedModel(name: string, settings: Object, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Updates a fine-tuned model
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model
    * @param {string} name - Fine-tuned model name
    * @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    updateFineTunedModel(finetuned_model_id: string, name: string, settings: Object, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Delete a fine-tuned model by ID
    * @async
    * @param {string} finetuned_model_id - The ID of the fine-tuned model
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    deleteFineTunedModel(finetuned_model_id: string): Promise<Object>;
}
import CohereClient = require("./CohereClient");
