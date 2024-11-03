export = embeddings;
/**
* Embeddings API
* @async
* @memberof MistralClient
* @method embeddings
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {String|Array} input - Input (string) or Array of Input (strings) (Input)
* @param {string} modelID - The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during chat completion generation
*/
declare function embeddings(httpRequest: AxiosInstance, throwError: Function, input: string | any[], modelID: string, newConfig?: Object | undefined): Promise<Object>;
