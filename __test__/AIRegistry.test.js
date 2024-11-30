import AIConnectifyError from '../lib/AIConnectifyError';
import AIRegistry from '../lib/connectors/AIRegistry';
import ChatGPT from '../lib/connectors/AI/ChatGPT/ChatGPT';

const fs = require('fs');
const path = require('path');
const aiConnectorsDirectory = path.resolve(__dirname, 'AI');
const directories = fs.readdirSync(aiConnectorsDirectory, { withFileTypes: true });

const aiRegistryInstance = new AIRegistry();
const testValidAI = "ChatGPT";
const testValidAIKey = "TEST_API_KEY_WITH_16_CHARACTERS";

describe("AIRegistry class", () => {
    describe("Create new instance", () => {
        it("Tests if the instance is created correctly", () => {
            expect(aiRegistryInstance).toBeInstanceOf(AIRegistry);
        });
    });
    describe("Use the class methods individually", () => {
        it("Tests if the '_loadAIs' method generates the AI list correctly", () => {
            expect(aiRegistryInstance.registeredAIs.lenght).toEqual(directories.lenght);
            expect(aiRegistryInstance.registeredAIs).toHaveProperty(testValidAI);
            expect(aiRegistryInstance.registeredAIs[testValidAI].apiKeyRequired).toBe(true);
        });
        it("Tests if the '_registerAI' method register a new AI service correctly", () => {
            const newAiService = {
                name: "ChatGPT",
                instance: new ChatGPT(testValidAIKey),
                apiKeyRequired: true
            }
            aiRegistryInstance._registerAI(newAiService.name, newAiService.instance, newAiService.apiKeyRequired);

            expect(aiRegistryInstance.registeredAIs.lenght).toEqual(directories.lenght);
            expect(aiRegistryInstance.registeredAIs).toHaveProperty(newAiService.name);
            expect(aiRegistryInstance.registeredAIs[newAiService.name].apiKeyRequired).toBe(newAiService.apiKeyRequired);
        });
        it("Tests if the 'getAI' method get the AI instance correctly", () => {
            const aiObject = aiRegistryInstance.getAI(testValidAI);
            expect(aiObject.aiInstance).toBeInstanceOf(ChatGPT);
        });
    });
    describe("Throw the AIConnectifyError error", () => {
        it("Tests when AI directory does not exist", () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(false);
            expect(() => new AIRegistry()).toThrow(AIConnectifyError);
            expect(() => new AIRegistry()).toThrow('AI connectors directory not found');
        });
        it('Tests when trying to get an unregistered AI', () => {
            expect(() => aiRegistryInstance.getAI('NonExistentAI')).toThrow(AIConnectifyError);
            expect(() => aiRegistryInstance.getAI('NonExistentAI')).toThrow('AI service NonExistentAI is not registered');
        });
    });
});
