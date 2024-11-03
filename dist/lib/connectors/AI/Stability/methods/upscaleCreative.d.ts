export = upscaleCreative;
/**
* Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution
* @async
* @memberof StabilityClient
* @method upscaleCreative
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} pathImage - The image (path - no the file name) you wish to upscale
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function upscaleCreative(httpRequest: AxiosInstance, throwError: Function, prompt: string, pathImage: string, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
