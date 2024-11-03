export = AIConnectify;
/**
* The main AI-Connectify class for creating instances of different AI connectors
* @class
*/
declare class AIConnectify {
    /**
    * Creates an instance of AIConnectify
    * @constructor
    * @param {string} ai - The name of the AI connector to use (e.g. 'TensorFlowNode', 'ChatGPT', 'DALLE')
    * @param {string|null} [apiKey=null] - The API key to use (if required by the AI connector)
    * @throws {AIConnectifyError} - If the ai parameter is not provided
    */
    constructor(ai: string, apiKey?: string | null | undefined);
    /**
    * The connector instance used by the AI-Connectify object
    * @member {object} connector
    */
    connector: object;
    /**
    * Proxy method to call functions from the connector instance
    * @param {string} methodName - The method to call on the connector
    * @param  {...any} args - The arguments to pass to the method
    * @returns {Promise} - The result of the method call
    */
    call(methodName: string, ...args: any[]): Promise<any>;
}
