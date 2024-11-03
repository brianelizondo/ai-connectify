export = createImageVariation;
/**
* Creates a variation of a given image
* @async
* @memberof DALLEClient
* @method createImageVariation
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} imagePath - The image PNG file (path - not file name) to use as the basis for the variation(s)
* @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createImageVariation(httpRequest: AxiosInstance, throwError: Function, imagePath: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
