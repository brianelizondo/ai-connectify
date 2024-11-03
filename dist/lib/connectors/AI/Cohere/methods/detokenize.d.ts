export = detokenize;
/**
* Takes tokens using byte-pair encoding and returns their text representation
* @async
* @memberof CohereClient
* @method detokenize
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} tokens The string to be tokenized
* @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function detokenize(httpRequest: AxiosInstance, throwError: Function, tokens: any[], modelID?: string | undefined): Promise<Object>;
