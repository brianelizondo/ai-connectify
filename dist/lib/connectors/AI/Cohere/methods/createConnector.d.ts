export = createConnector;
/**
* Creates a new connector
* @async
* @memberof CohereClient
* @method createConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} name - A human-readable name for the connector
* @param {string} url - The URL of the connector that will be used to search for documents
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createConnector(httpRequest: AxiosInstance, throwError: Function, name: string, url: string, newConfig?: Object | undefined): Promise<Object>;
