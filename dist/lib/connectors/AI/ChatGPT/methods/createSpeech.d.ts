export = createSpeech;
/**
* Generates audio from the input text
* @async
* @memberof ChatGPTClient
* @method createSpeech
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string} input - The text to generate audio for. The maximum length is 4096 characters
* @param {string} destinationFolder - Folder path to save the file generated
* @param {string} [modelID="tts-1"] - (Optional) The ID of the model to use
* @param {string} [voice="alloy"] - (Optional) The voice to use when generating the audio
* @param {string} [response_format="mp3"] - (Optional) The format to audio in
* @param {Object} [newConfig={}] - (Optional) Additional parameters to customize the request
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
declare function createSpeech(httpRequest: AxiosInstance, throwError: Function, input: string, destinationFolder: string, modelID?: string | undefined, voice?: string | undefined, response_format?: string | undefined, newConfig?: Object | undefined): Promise<Object>;
