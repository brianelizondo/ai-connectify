export = createFineTuningJob;
/**
* Creates a fine-tuning job which begins the process of creating a new model from a given dataset
* @async
* @memberof MistralClient
* @method createFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Object} hyperparameters - The fine-tuning hyperparameter settings used in a fine-tune job
* @param {string} [modelID="mistral-small-latest"] - (Optional) The ID of the model to use
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createFineTuningJob(httpRequest: AxiosInstance, throwError: Function, hyperparameters: Object, modelID?: string | undefined, newConfig: any): Promise<any[]>;
