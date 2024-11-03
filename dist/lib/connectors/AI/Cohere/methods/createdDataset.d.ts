export = createDataset;
/**
* Create a dataset by uploading a file
* @async
* @memberof CohereClient
* @method createDataset
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} name - The name of the uploaded dataset
* @param {string} filePath - File to create the dataset
* @param {string} type - The dataset type, which is used to validate the data
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createDataset(httpRequest: AxiosInstance, throwError: Function, name: string, filePath: string, type: string, newConfig?: Object | undefined): Promise<Object>;
