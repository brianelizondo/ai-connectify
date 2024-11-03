export = createChatCompletion;
/**
* Chat Completion API
* @async
* @memberof MistralClient
* @method createChatCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
* @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function createChatCompletion(httpRequest: AxiosInstance, throwError: Function, messagesArray: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
