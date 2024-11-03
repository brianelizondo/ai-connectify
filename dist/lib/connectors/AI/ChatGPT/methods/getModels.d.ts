export = getModels;
/**
* Module and dependencies
* @module
*/
/**
* Lists the currently available models, and provides basic information about each one such as the owner and availability
* @async
* @memberof ChatGPTClient
* @method getModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getModels(httpRequest: AxiosInstance, throwError: Function): Promise<any[]>;
