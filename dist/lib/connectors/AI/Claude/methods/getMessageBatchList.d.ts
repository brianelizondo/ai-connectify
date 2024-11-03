export = getMessageBatchList;
/**
* (Beta) List all Message Batches within a Workspace
* @async
* @memberof ClaudeClient
* @method getMessageBatchList
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function getMessageBatchList(httpRequest: AxiosInstance, throwError: Function, newConfig?: Object | undefined): Promise<Object>;
