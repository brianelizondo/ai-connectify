export = getModels;
/**
* Module and dependencies
* @module
*/
/**
* List all models available to the user
* @async
* @memberof MistralClient
* @method getModels
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getModels(httpRequest: AxiosInstance, throwError: Function): Promise<any[]>;
