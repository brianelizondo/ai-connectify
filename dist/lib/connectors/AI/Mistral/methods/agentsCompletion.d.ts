export = agentsCompletion;
/**
* Agents API
* @async
* @memberof MistralClient
* @method agentsCompletion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} messagesArray - The prompt(s) to generate completions for, encoded as a list of dict with role and content
* @param {string} agentID - The ID of the agent to use for this completion
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function agentsCompletion(httpRequest: AxiosInstance, throwError: Function, messagesArray: any[], agentID: string, newConfig?: Object | undefined): Promise<Object>;
