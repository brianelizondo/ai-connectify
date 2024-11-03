export = createChatCompletion;
/**
* Creates a model response for the given chat conversation
* @async
* @memberof ChatGPTClient
* @method createChatCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - A list of messages describing the conversation so far
* @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function createChatCompletion(httpRequest: AxiosInstance, throwError: Function, messagesArray: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
