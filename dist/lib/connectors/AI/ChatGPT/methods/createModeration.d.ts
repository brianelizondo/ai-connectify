export = createModeration;
/**
* Given some input text, outputs if the model classifies it as potentially harmful across several categories
* @async
* @memberof ChatGPTClient
* @method createModeration
* @param {AxiosInstance} httpRequest - An instance of Axios for making HTTP requests
* @param {Function} throwError - A function to handle and throw errors
* @param {string|Array} input - Input (or inputs) to classify
* @param {string} [modelID="omni-moderation-latest] - (Optional) The ID of the model to use
* @returns {Promise<Object>} - A Promise that resolves the generated request
* @throws {AIConnectifyError} - Will throw an error if an error occurs during generation
*/
declare function createModeration(httpRequest: AxiosInstance, throwError: Function, input: string | any[], modelID?: string | undefined): Promise<any>;