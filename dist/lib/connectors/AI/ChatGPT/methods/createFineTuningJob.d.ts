export = createFineTuningJob;
/**
* Creates a fine-tuning job which begins the process of creating a new model from a given dataset
* @async
* @memberof ChatGPTClient
* @method createFineTuningJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} training_file_id - The ID of an uploaded file that contains training data
* @param {string} [modelID="gpt-4o-mini"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
declare function createFineTuningJob(httpRequest: AxiosInstance, throwError: Function, training_file_id: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
