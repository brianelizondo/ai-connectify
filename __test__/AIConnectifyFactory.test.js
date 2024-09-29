import 'dotenv/config';
import AIConnectifyError from '../lib/AIConnectifyError';
import { createAIInstance } from '../lib/connectors/AIConnectifyFactory';
import TensorFlow from '../lib/connectors/AI/TensorFlow/TensorFlow';
import ChatGPT from '../lib/connectors/AI/ChatGPT/ChatGPT';

const aiServiceWithKey = "ChatGPT";
const aiServiceWithoutKey = "TensorFlow";
const aiServiceKey = process.env.AI_SERVICE_APIKEY || "AI-SERVICE-APIKEY";

describe("AIConnectifyFactory", () => {
    describe("createAIInstance function", () => {
        it("Tests if returns the correct instance for a supported AI without apiKey", () => {
            const aiInstance = createAIInstance(aiServiceWithoutKey);
            expect(aiInstance).toBeInstanceOf(TensorFlow);
        });
        it("Tests if returns the correct instance for a supported AI with apiKey", () => {
            const aiInstance = createAIInstance(aiServiceWithKey, aiServiceKey);
            expect(aiInstance).toBeInstanceOf(ChatGPT);
        });
    });
    
    describe("Throw the AIConnectifyError error", () => {
        it("Tests when AI parameter is missing", () => {
            expect(() => createAIInstance()).toThrow(AIConnectifyError);
        });
        it("Tests if an apiKey is required but is missing", () => {
            expect(() => createAIInstance(aiServiceWithKey)).toThrow(AIConnectifyError);
        });
        it("Tests when an invalid AI parameter is provided", () => {
            expect(() => createAIInstance("testInvalidAI")).toThrow(AIConnectifyError);
        });
        it("Tests when an invalid apiKey parameter is provided", () => {
            expect(() => createAIInstance("******")).toThrow(AIConnectifyError);
        });
    });
});