export = updateConnector;
/**
* Update a connector by ID
* @async
* @memberof CohereClient
* @method updateConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the connector to update
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function updateConnector(httpRequest: AxiosInstance, throwError: Function, connector_id: string, newConfig?: Object | undefined): Promise<Object>;
