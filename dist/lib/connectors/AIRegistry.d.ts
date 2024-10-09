export = AIRegistry;
/**
* AIRegistry class
* This class dynamically loads AI connectors from the 'AI' directory and registers them
* It provides methods to register AIs and retrieve registered AIs
* @class AIRegistry
*/
declare class AIRegistry {
    registeredAIs: {};
    /**
    * Register an AI class with its name and whether it requires an API key
    * @param {string} aiName - The name of the AI
    * @param {class} AIClass - The class representing the AI service
    * @param {boolean} apiKeyRequired - Whether this AI requires an API key
    */
    _registerAI(aiName: string, AIClass: class, apiKeyRequired: boolean): void;
    /**
    * Loads and registers all AI modules from the AI directory
    * This method dynamically reads subdirectories in the 'AI' folder, where each subdirectory represents an AI service
    * For each AI, it attempts to load the main class file and the config file
    */
    _loadAIs(): void;
    /**
    * Retrieves the registered AI class and its API key requirement.
    * @param {string} aiName - The name of the AI to retrieve.
    * @returns {object} - The AI class and its API key requirement status.
    * @throws {AIConnectifyError} - Throws an error if the AI is not registered.
    */
    getAI(aiName: string): object;
}
