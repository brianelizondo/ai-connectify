export = getMessageBatchResults;
/**
* (Beta) Streams the results of a Message Batch as a .jsonl file
* @async
* @memberof ClaudeClient
* @method getMessageBatchResults
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} messageBatchID - ID of the Message Batch
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function getMessageBatchResults(httpRequest: AxiosInstance, throwError: Function, messageBatchID: string): Promise<Object>;
