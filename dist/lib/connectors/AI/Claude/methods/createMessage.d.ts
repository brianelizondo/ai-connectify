export = createMessage;
/**
* Send a structured list of input messages with text and/or image content
* @async
* @memberof ClaudeClient
* @method createMessage
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - A list of messages describing the conversation so far
* @param {String} [modelID="claude-3-5-sonnet-20240620"] - (Optional) The ID of the model to use
* @param {Number} [maxTokens=1024] - (Optional) The maximum number of tokens to generate before stopping
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function createMessage(httpRequest: AxiosInstance, throwError: Function, messagesArray: any[], modelID?: string | undefined, maxTokens?: number | undefined, newConfig?: Object | undefined): Promise<Object>;
