import ChatGPT from './connectors/AI/ChatGPT/ChatGPT';
import Cohere from './connectors/AI/Cohere/Cohere';
import DALLE from './connectors/AI/DALLE/DALLE';
import Stability from './connectors/AI/Stability/Stability';
import TensorFlow from './connectors/AI/TensorFlow/TensorFlow';

/**
* A mapping of AI connectors to their respective classes
* @typedef {Object} AIConnectorMap
* @property {ChatGPT} ChatGPT - The ChatGPT connector
* @property {Cohere} Cohere - The Cohere connector
* @property {DALLE} DALLE - The DALL-E connector
* @property {Stability} Stability - The Stability connector
* @property {TensorFlow} TensorFlow - The TensorFlow connector
*/
type AIConnectorMap = {
    ChatGPT: ChatGPT;
    Cohere: Cohere;
    DALLE: DALLE;
    Stability: Stability;
    TensorFlow: TensorFlow;
};

/**
* A union type representing the names of available AI connectors
* @typedef {keyof AIConnectorMap} AIConnectors
*/
type AIConnectors = keyof AIConnectorMap;

export = AIConnectify;

/**
* The main AI-Connectify class for creating instances of different AI connectors
* @class AIConnectify
* @template T - The type of AI connector being used
*/
declare class AIConnectify<T extends AIConnectors> {
    /**
    * Creates an instance of AIConnectify
    * @constructor
    * @param {T} ai - The name of the AI connector to use (e.g. 'ChatGPT', 'DALLE')
    * @param {string|null} [apiKey=null] - The API key to use (if required by the AI connector)
    * @throws {AIConnectifyError} - If the ai parameter is not provided or is invalid
    */
    constructor(ai: T, apiKey?: string | null | undefined);
    
    /**
    * The connector instance used by the AI-Connectify object
    * @member {AIConnectorMap[T]} connector
    * @readonly
    */
    readonly connector: AIConnectorMap[T];
    
    /**
    * Proxy method to call functions from the connector instance
    * @param {M} methodName - The method to call on the connector
    * @param  {...any} args - The arguments to pass to the method
    * @returns {Promise<R>} - The result of the method call
    * @template M - The method name type
    * @template R - The return type of the method
    * @throws {AIConnectifyError} - If the method does not exist on the connector
    */
    call<M extends keyof AIConnectorMap[T]>(
        methodName: M,
        ...args: AIConnectorMap[T][M] extends (...args: infer P) => any ? P : never
    ): AIConnectorMap[T][M] extends (...args: any[]) => infer R ? R : never;
}
