export = chat;
/**
* Generates a text response to a user message
* @async
* @memberof CohereClient
* @method chat
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messages - Array of text input for the model to respond to
* @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function chat(httpRequest: AxiosInstance, throwError: Function, messages: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
