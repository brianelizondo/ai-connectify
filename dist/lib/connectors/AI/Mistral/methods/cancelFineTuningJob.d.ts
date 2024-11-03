export = cancelFineTuningJob;
/**
* Request the start of a validated fine tuning job
* @async
* @memberof MistralClient
* @method cancelFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the job to analyse
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function cancelFineTuningJob(httpRequest: AxiosInstance, throwError: Function, fine_tuning_job_id: string): Promise<any[]>;
