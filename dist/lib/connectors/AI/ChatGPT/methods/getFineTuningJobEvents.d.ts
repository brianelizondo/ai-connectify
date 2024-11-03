export = getFineTuningJobEvents;
/**
* Get status updates for a fine-tuning job
* @async
* @memberof ChatGPTClient
* @method getFineTuningJobEvents
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_job_id - The ID of the fine-tuning job to get events for
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTuningJobEvents(httpRequest: AxiosInstance, throwError: Function, fine_tuning_job_id: string, newConfig?: Object | undefined): Promise<Object>;
