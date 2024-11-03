export = generateImageUltra;
/**
* Creates the highest quality images with unprecedented prompt understanding
* @async
* @memberof StabilityClient
* @method generateImageUltra
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function generateImageUltra(httpRequest: AxiosInstance, throwError: Function, prompt: string, destinationFolder: string, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
