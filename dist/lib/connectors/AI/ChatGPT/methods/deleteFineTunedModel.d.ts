export = deleteFineTunedModel;
/**
* Delete a fine-tuned model. You must have the Owner role in your organization to delete a model
* @async
* @memberof ChatGPTClient
* @method deleteFineTunedModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} modelID - The ID of the model to delete
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function deleteFineTunedModel(httpRequest: AxiosInstance, throwError: Function, modelID: string): Promise<Object>;
