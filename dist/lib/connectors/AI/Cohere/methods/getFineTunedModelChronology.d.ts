export = getFineTunedModelChronology;
/**
* Retrieves the chronology of statuses the fine-tuned model has been through
* @async
* @memberof CohereClient
* @method getFineTunedModelChronology
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The parent fine-tuned model ID
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTunedModelChronology(httpRequest: AxiosInstance, throwError: Function, finetuned_model_id: string, newConfig?: Object | undefined): Promise<Object>;
