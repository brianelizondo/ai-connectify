export = createFineTunedModel;
/**
* Trains and deploys a fine-tuned model
* @async
* @memberof CohereClient
* @method createFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} name - Fine-tuned model name
* @param {Object} settings - Fine-tuned model settings such as dataset, hyperparameters…
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createFineTunedModel(httpRequest: AxiosInstance, throwError: Function, name: string, settings: Object, newConfig?: Object | undefined): Promise<Object>;
