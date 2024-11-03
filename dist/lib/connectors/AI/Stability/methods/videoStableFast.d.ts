export = videoStableFast;
/**
* Stable Fast 3D generates high-quality 3D assets from a single 2D input image
* @async
* @memberof StabilityClient
* @method videoStableFast
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) to generate a 3D model from
* @param {string} destinationFolder - Folder path to save the video generated
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function videoStableFast(httpRequest: AxiosInstance, throwError: Function, pathImage: string, destinationFolder: string, newConfig?: Object | undefined): Promise<Object>;
