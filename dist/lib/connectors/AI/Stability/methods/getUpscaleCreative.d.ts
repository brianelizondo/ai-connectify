export = getUpscaleCreative;
/**
* Fetch the result of an upscale generation by ID
* @async
* @memberof StabilityClient
* @method getUpscaleCreative
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} upscaleId - The id of a generation, typically used for async generations
* @param {string} destinationFolder - Folder path to save the image generated
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getUpscaleCreative(httpRequest: AxiosInstance, throwError: Function, upscaleId: string, destinationFolder: string): Promise<Object>;
