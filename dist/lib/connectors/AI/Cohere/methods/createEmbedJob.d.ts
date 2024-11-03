export = createEmbedJob;
/**
* Launches an async Embed job for a Dataset of type embed-input
* @async
* @memberof CohereClient
* @method createEmbedJob
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} dataset_id - ID of a Dataset. The Dataset must be of type embed-input
* @param {string} [modelID="embed-english-v3.0"] - (Optional) The ID of the model to use
* @param {string} [input_type="classification"] - (Optional) Specifies the type of input passed to the model
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createEmbedJob(httpRequest: AxiosInstance, throwError: Function, dataset_id: string, modelID?: string | undefined, input_type?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
