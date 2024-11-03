export = tokenize;
/**
* Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE)
* @async
* @memberof CohereClient
* @method tokenize
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} text The string to be tokenized
* @param {string} [modelID="command-r-plus-08-2024"] - (Optional) The ID of the model to use
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function tokenize(httpRequest: AxiosInstance, throwError: Function, text: string, modelID?: string | undefined): Promise<Object>;
