export = removeBackground;
/**
* The Remove Background service accurately segments the foreground from an image and implements and removes the background
* @async
* @memberof StabilityClient
* @method removeBackground
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The image (path - no the file name) whose background you wish to remove
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function removeBackground(httpRequest: AxiosInstance, throwError: Function, pathImage: string, destinationFolder: string, output_format?: string | undefined): Promise<Object>;
