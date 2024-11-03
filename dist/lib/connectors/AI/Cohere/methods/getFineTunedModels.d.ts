export = getFineTunedModels;
/**
* Returns a list of fine-tuned models available for use
* @async
* @memberof CohereClient
* @method getFineTunedModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTunedModels(httpRequest: AxiosInstance, throwError: Function, newConfig?: Object | undefined): Promise<Object>;
