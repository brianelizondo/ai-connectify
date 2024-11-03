export = cancelMessageBatch;
/**
* (Beta) Batches may be canceled any time before processing ends
* @async
* @memberof ClaudeClient
* @method cancelMessageBatch
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String} messageBatchID - ID of the Message Batch
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function cancelMessageBatch(httpRequest: AxiosInstance, throwError: Function, messageBatchID: string): Promise<Object>;
