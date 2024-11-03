export = getModel;
/**
* Retrieves a model instance, providing basic information about the model such as the owner and permissioning
* @async
* @memberof ChatGPTClient
* @method getModel
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} modelID - The ID of the model to use for this request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getModel(httpRequest: AxiosInstance, throwError: Function, modelID: string): Promise<Object>;
