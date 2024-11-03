export = getDatasetUsage;
/**
* Retrieves the dataset storage usage for your Organization
* @async
* @memberof CohereClient
* @method getDatasetUsage
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getDatasetUsage(httpRequest: AxiosInstance, throwError: Function): Promise<Object>;
