export = getFineTunedModel;
/**
* Retrieve a fine-tuned model by ID
* @async
* @memberof CohereClient
* @method getFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} finetuned_model_id - The fine-tuned model ID
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getFineTunedModel(httpRequest: AxiosInstance, throwError: Function, finetuned_model_id: string): Promise<Object>;
