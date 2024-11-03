export = updateFineTuningModel;
/**
* Get a list of fine-tuning jobs for your organization and user
* @async
* @memberof MistralClient
* @method updateFineTuningModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_model_id - The ID of the model to update
* @param {Object} [newConfig={}] - (Optional) (Optional) Name and description to update the model
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function updateFineTuningModel(httpRequest: AxiosInstance, throwError: Function, fine_tuning_model_id: string, newConfig?: Object | undefined): Promise<any[]>;
