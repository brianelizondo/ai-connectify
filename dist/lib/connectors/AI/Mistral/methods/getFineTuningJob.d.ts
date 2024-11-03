export = getFineTuningJob;
/**
* Get a list of fine-tuning jobs for your organization and user
* @async
* @memberof MistralClient
* @method getFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the job to analyse
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTuningJob(httpRequest: AxiosInstance, throwError: Function, fine_tuning_job_id: string): Promise<any[]>;
