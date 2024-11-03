export = getFineTunedModelMetrics;
/**
* Retrieves metrics measured during the training of a fine-tuned model
* @async
* @memberof CohereClient
* @method getFineTunedModelMetrics
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The parent fine-tuned model ID
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTunedModelMetrics(httpRequest: AxiosInstance, throwError: Function, finetuned_model_id: string, newConfig?: Object | undefined): Promise<Object>;
