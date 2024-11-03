export = authorizeConnector;
/**
* Authorize with oAuth a connector by ID
* @async
* @memberof CohereClient
* @method authorizeConnector
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} connector_id - The ID of the connector to authorize
* @param {string} [afterTokenRedirectUrl=false] - (Optional) The URL to redirect to after the connector has been authorized
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function authorizeConnector(httpRequest: AxiosInstance, throwError: Function, connector_id: string, afterTokenRedirectUrl?: string | undefined): Promise<Object>;
