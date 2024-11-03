export = createMessageBatch;
/**
* (Beta) The Message Batches API can be used to process multiple Messages API requests at once
* @async
* @memberof ClaudeClient
* @method createMessageBatch
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} requests - List of requests for prompt completion. Each is an individual request to create a Message
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function createMessageBatch(httpRequest: AxiosInstance, throwError: Function, requests: any[]): Promise<Object>;
