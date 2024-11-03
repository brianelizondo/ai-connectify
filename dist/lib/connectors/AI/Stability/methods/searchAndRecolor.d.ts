export = searchAndRecolor;
/**
* The Search and Recolor service provides the ability to change the color of a specific object in an image using a prompt
* @async
* @memberof StabilityClient
* @method searchAndRecolor
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} select_prompt - Short description of what to search for in the image
* @param {string} pathImage - An image (path - no the file name) containing content you wish to recolor
* @param {string} destinationFolder - Folder path to save the image generated
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function searchAndRecolor(httpRequest: AxiosInstance, throwError: Function, prompt: string, select_prompt: string, pathImage: string, destinationFolder: string, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
