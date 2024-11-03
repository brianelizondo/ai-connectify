export = cancelEmbedJob;
/**
* Allows to cancel an active embed job
* @async
* @memberof CohereClient
* @method cancelEmbedJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} embed_job_id - The ID of the embed job to cancel
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function cancelEmbedJob(httpRequest: AxiosInstance, throwError: Function, embed_job_id: string): Promise<Object>;
