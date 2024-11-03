export = createImage;
/**
* Given a prompt and/or an input image, the model will generate a new image
* @async
* @memberof DALLEClient
* @method createImage
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - A text description of the desired image(s)
* @param {string} [modelID="dall-e-2"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Array>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function createImage(httpRequest: AxiosInstance, throwError: Function, prompt: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<any[]>;
