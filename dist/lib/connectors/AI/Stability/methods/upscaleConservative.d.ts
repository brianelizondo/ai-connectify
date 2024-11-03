export = upscaleConservative;
/**
* Tools for increasing the size of your existing images
* @async
* @memberof StabilityClient
* @method upscaleConservative
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} pathImage - The image (path - no the file name) you wish to upscale
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function upscaleConservative(httpRequest: AxiosInstance, throwError: Function, prompt: string, pathImage: string, destinationFolder: string, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
