export = rerank;
/**
* Takes in a query and a list of texts and produces an ordered array with each text assigned a relevance score
* @async
* @memberof CohereClient
* @method rerank
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} query - The search query
* @param {Array} documents - Array of document objects or strings to rerank
* @param {string} [modelID="rerank-english-v3.0"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function rerank(httpRequest: AxiosInstance, throwError: Function, query: string, documents: any[], modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
