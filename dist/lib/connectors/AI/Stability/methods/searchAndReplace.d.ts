export = searchAndReplace;
/**
* The Search and Replace service is a specific version of inpainting that does not require a mask
* @async
* @memberof StabilityClient
* @method searchAndReplace
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} search_prompt - Short description of what to inpaint in the image
* @param {string} pathImage - An image (path - no the file name) containing content you wish to replace
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function searchAndReplace(httpRequest: AxiosInstance, throwError: Function, prompt: string, search_prompt: string, pathImage: string, destinationFolder: string, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
