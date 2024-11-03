export = archiveFineTuningModel;
/**
* Archive a fine-tuned model
* @async
* @memberof MistralClient
* @method archiveFineTuningModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} fine_tuning_model_id - The ID of the model to archive
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function archiveFineTuningModel(httpRequest: AxiosInstance, throwError: Function, fine_tuning_model_id: string): Promise<any[]>;