export = updateFineTunedModel;
/**
* Updates a fine-tuned model
* @async
* @memberof CohereClient
* @method updateFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The ID of the fine-tuned model
* @param {string} name - Fine-tuned model name
* @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function updateFineTunedModel(httpRequest: AxiosInstance, throwError: Function, finetuned_model_id: string, name: string, settings: Object, newConfig?: Object | undefined): Promise<Object>;
