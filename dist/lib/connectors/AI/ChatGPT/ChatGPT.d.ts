export = ChatGPT;
/**
* Represents a ChatGPT AI instance
* Handles interaction with the OpenAI API for chat, completions, edits, and model information
* @exports ChatGPT
* @class
*/
declare class ChatGPT {
    /**
    * Create a ChatGPT instance
    * @constructor
    * @param {string} apiKey - The API key for OpenAI
    * @throws {AIConnectifyError} - Will throw an error if the API key is invalid
    */
    constructor(apiKey: string);
    client: ChatGPTClient;
    /**
    * Set the Organization ID to the ChatGPTClient instance
    * @param {string} organizationID - The organization ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setOrganizationId(organizationID: string): void;
    /**
    * Set the Project ID to the ChatGPTClient instance
    * @param {string} projectID - The Project ID for OpenAI instance
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    setProjectId(projectID: string): void;
    /** MODELS METHODS **/
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
    /**
    * Delete a fine-tuned model. You must have the Owner role in your organization to delete a model
    * @async
    * @param {string} modelID - The ID of the model to delete
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    deleteFineTunedModel(modelID: string): Promise<Object>;
    /** CHAT METHODS **/
    /**
    * Creates a model response for the given chat conversation
    * @async
    * @param {Array} messagesArray - A list of messages describing the conversation so far
    * @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
    */
    createChatCompletion(messagesArray: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /** EMBEDDINGS METHODS **/
    /**
    * Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms
    * @async
    * @param {string|Array} input - Input text to embed, encoded as a string or array of tokens
    * @param {string} [modelID="text-embedding-ada-002"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Array>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createEmbeddings(input: string | any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
    /** MODERATIONS METHODS **/
    /**
    * Given some input text, outputs if the model classifies it as potentially harmful across several categories
    * @async
    * @param {string|Array} input - Input (or inputs) to classify
    * @param {string} [modelID="omni-moderation-latest"] - (Optional) The ID of the model to use
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createModeration(input: string | any[], modelID?: string | undefined): Promise<Object>;
    /** AUDIO METHODS **/
    /**
    * Generates audio from the input text
    * @async
    * @param {string} input - The text to generate audio for. The maximum length is 4096 characters
    * @param {string} destinationFolder - Folder path to save the file generated
    * @param {string} [modelID="tts-1"] - (Optional) The ID of the model to use
    * @param {string} [voice="alloy"] - (Optional) The voice to use when generating the audio
    * @param {string} [response_format="mp3"] - (Optional) The format to audio in
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createSpeech(input: string, destinationFolder: string, modelID?: string | undefined, voice?: string | undefined, response_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Transcribes audio into the input language
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<String>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createTranscription(filePath: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<string>;
    /**
    * Translates audio into English
    * @async
    * @param {string} filePath - The audio file object (path - not file name) to transcribe
    * @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<String>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createTranslation(filePath: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<string>;
    /** FINE-TUNING METHODS **/
    /**
    * Get info about a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJob(fine_tuning_job_id: string): Promise<Object>;
    /**
    * List your organization's fine-tuning jobs
    * @async
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJobs(newConfig?: Object | undefined): Promise<Object>;
    /**
    * Get status updates for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJobEvents(fine_tuning_job_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * List checkpoints for a fine-tuning job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get checkpoints for
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    getFineTuningJobCheckpoints(fine_tuning_job_id: string, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Creates a fine-tuning job which begins the process of creating a new model from a given dataset
    * @async
    * @param {string} training_file_id - The ID of an uploaded file that contains training data
    * @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
    * @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
    */
    createFineTuningJob(training_file_id: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
    /**
    * Immediately cancel a fine-tune job
    * @async
    * @param {string} fine_tuning_job_id - The ID of the fine-tuning job to cancel
    * @returns {Promise<Object>} - A Promise that resolves the generated request
    * @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
    */
    cancelFineTuningJob(fine_tuning_job_id: string): Promise<Object>;
}
import ChatGPTClient = require("./ChatGPTClient");
