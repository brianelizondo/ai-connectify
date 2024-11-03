export = AIRegistry;
/**
* This class dynamically loads AI connectors from the 'AI' directory and registers them
* It provides methods to register AIs and retrieve registered AIs
* @class
*/
declare class AIRegistry {
    registeredAIs: {};
    /**
    * Register an AI class with its name and whether it requires an API key
    * @private
    * @param {string} aiName - The name of the AI
    * @param {class} AIClass - The class representing the AI service
    * @param {boolean} apiKeyRequired - Whether this AI requires an API key
    */
    private _registerAI;
    /**
    * Loads and registers all AI modules from the AI directory
    * This method dynamically reads subdirectories in the 'AI' folder, where each subdirectory represents an AI service
    * For each AI, it attempts to load the main class file and the config file
    * @private
    */
    private _loadAIs;
    /**
    * Retrieves the registered AI class and its API key requirement
    * @param {string} aiName - The name of the AI to retrieve
    * @returns {object} - The AI class and its API key requirement status
    * @throws {AIConnectifyError} - Throws an error if the AI is not registered
    */
    getAI(aiName: string): object;
}
