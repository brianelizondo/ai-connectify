export = createTranscription;
/**
* Transcribes audio into the input language
* @async
* @memberof ChatGPTClient
* @method createTranscription
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} filePath - The audio file object (path - not file name) to transcribe
* @param {string} [modelID="whisper-1"] - (Optional) The ID of the model to use
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<String>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
declare function createTranscription(httpRequest: AxiosInstance, throwError: Function, filePath: string, modelID?: string | undefined, newConfig?: Object | undefined): Promise<string>;
