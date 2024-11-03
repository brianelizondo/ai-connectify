export = getMessageBatch;
/**
* (Beta) The Message Batches API can be used to process multiple Messages API requests at once
* @async
* @memberof ClaudeClient
* @method getMessageBatch
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} messageBatchID - ID of the Message Batch
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function getMessageBatch(httpRequest: AxiosInstance, throwError: Function, messageBatchID: string): Promise<Object>;
