export = classify;
/**
* Makes a prediction about which label fits the specified text inputs best
* @async
* @memberof CohereClient
* @method classify
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {Array} inputs - A list of up to 96 texts to be classified
* @param {Array} [examples=[]] - (Optional) An array of examples to provide context to the model. Each example is a text string and its associated label/class
* @param {string} [modelID="embed-english-v2.0"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function classify(httpRequest: AxiosInstance, throwError: Function, inputs: any[], examples?: any[] | undefined, modelID?: string | undefined, newConfig?: Object | undefined): Promise<Object>;