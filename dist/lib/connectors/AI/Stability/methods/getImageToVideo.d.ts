export = getImageToVideo;
/**
* Fetch the result of an image-to-video generation by ID
* @async
* @memberof StabilityClient
* @method getImageToVideo
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} videoId - The id of a generation
* @param {string} destinationFolder - Folder path to save the video generated
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during the request
*/
declare function getImageToVideo(httpRequest: AxiosInstance, throwError: Function, videoId: string, destinationFolder: string): Promise<Object>;
