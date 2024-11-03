export = deleteFineTunedModel;
/**
* Delete a fine-tuned model by ID
* @async
* @memberof CohereClient
* @method deleteFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The ID of the fine-tuned model
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function deleteFineTunedModel(httpRequest: AxiosInstance, throwError: Function, finetuned_model_id: string): Promise<Object>;
