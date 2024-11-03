export = getConnectors;
/**
* Returns a list of connectors ordered by descending creation date (newer first)
* @async
* @memberof CohereClient
* @method getConnectors
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getConnectors(httpRequest: AxiosInstance, throwError: Function, newConfig?: Object | undefined): Promise<any[]>;