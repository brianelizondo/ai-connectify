export = embed;
/**
* Generates an embedding list of floating point numbers that captures semantic information about the text that it represents
* @async
* @memberof CohereClient
* @method embed
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} input_type - Specifies the type of input passed to the model
* @param {Array} embedding_types - Specifies the types of embeddings you want to get back
* @param {string} [modelID="embed-english-v3.0"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function embed(httpRequest: AxiosInstance, throwError: Function, input_type: string, embedding_types: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
