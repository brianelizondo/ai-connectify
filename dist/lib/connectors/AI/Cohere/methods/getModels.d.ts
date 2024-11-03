export = getModels;
/**
* List of models available for use. The list contains models from Cohere as well as your fine-tuned models
* @async
* @memberof CohereClient
* @method getModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getModels(httpRequest: AxiosInstance, throwError: Function, newConfig?: Object | undefined): Promise<Object>;
