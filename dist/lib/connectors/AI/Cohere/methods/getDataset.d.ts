export = getDataset;
/**
* Retrieve a dataset by ID
* @async
* @memberof CohereClient
* @method getDataset
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} dataset_id - The ID of the dataset to retrieve
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getDataset(httpRequest: AxiosInstance, throwError: Function, dataset_id: string): Promise<Object>;
