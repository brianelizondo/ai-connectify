export = generateImageDiffusion;
/**
* Tools for generating new images using a Stable Diffusion 3 model
* @async
* @memberof StabilityClient
* @method generateImageDiffusion
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} prompt - What you wish to see in the output image
* @param {string} destinationFolder - Folder path to save the image generated
* @param {number} strength - Controls how much influence the image parameter has on the generated image
* @param {string} [modelID="sd3.5-medium"] - (Optional) The ID of the model to use
* @param {number} [mode="text-to-image"] - (Optional) Controls whether this is a text-to-image or image-to-image generation
* @param {string} [output_format="png"] - (Optional) The output format for the response
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function generateImageDiffusion(httpRequest: AxiosInstance, throwError: Function, prompt: string, destinationFolder: string, strength: number, modelID?: string | undefined, mode?: number | undefined, output_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
