export = getEmbedJobs;
/**
* Generates a list embed job endpoint allows users to view all embed jobs history for that specific user
* @async
* @memberof CohereClient
* @method getEmbedJobs
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getEmbedJobs(httpRequest: AxiosInstance, throwError: Function): Promise<any[]>;
