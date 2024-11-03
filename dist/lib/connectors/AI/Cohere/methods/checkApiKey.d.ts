export = checkApiKey;
/**
* Checks that the api key in the Authorization header is valid and active
* @async
* @memberof CohereClient
* @method checkApiKey
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Object>} - A Promise that resolves with the generated chat completion
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function checkApiKey(httpRequest: AxiosInstance, throwError: Function): Promise<Object>;
