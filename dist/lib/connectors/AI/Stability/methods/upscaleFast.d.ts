export = upscaleFast;
/**
* Fast Upscaler service enhances image resolution by 4x using predictive and generative AI
* @async
* @memberof StabilityClient
* @method upscaleFast
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) you wish to upscale
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function upscaleFast(httpRequest: AxiosInstance, throwError: Function, pathImage: string, destinationFolder: string, output_format?: string | undefined): Promise<Object>;
