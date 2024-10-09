/**
* Creates an instance of the AI connector for the specified AI
* This function retrieves the AI class and API key requirement from the AIRegistry,
* validates the API key if needed, and returns a new instance of the AI class.
*
* @function createAIInstance
* @param {string} ai - The name of the AI to use (e.g. TensorFlowNode, ChatGPT, DALLE, or Cohere)
* @param {string} [apiKey=null] - The API key required for some AIs. It can be null if the AI does not need an API key
* @returns {object} An instance of the AI connector
* @throws {AIConnectifyError} Throws an error if the API key is required but not provided
*/
export function createAIInstance(ai: string, apiKey?: string | undefined): object;
