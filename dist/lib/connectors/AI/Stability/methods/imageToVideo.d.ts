export = imageToVideo;
/**
* Generate a short video based on an initial image with Stable Video Diffusion, a latent video diffusion model
* @async
* @memberof StabilityClient
* @method imageToVideo
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} pathImage - The source image (path - no the file name) used in the video generation process
* @param {string} [cfg_scale=1.8] - (Optional) How strongly the video sticks to the original image
* @param {string} [motion_bucket_id=127] - (Optional) Lower values generally result in less motion in the output video
* @param {Object} [seed=0] - (Optional) A specific value that is used to guide the 'randomness' of the generation
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function imageToVideo(httpRequest: AxiosInstance, throwError: Function, pathImage: string, cfg_scale?: string | undefined, motion_bucket_id?: string | undefined, seed?: Object | undefined): Promise<Object>;
