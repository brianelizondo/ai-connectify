export = fimCompletion;
/**
* Fill-in-the-middle API
* @async
* @memberof MistralClient
* @method fimCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} prompt - The text/code to complete
* @param {string} [modelID="codestral-2405"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function fimCompletion(httpRequest: AxiosInstance, throwError: Function, prompt: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
