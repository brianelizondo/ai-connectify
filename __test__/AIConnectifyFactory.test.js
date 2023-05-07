import AIConnectifyError from '../lib/AIConnectifyError';
import getAIInstance from '../lib/connectors/AIConnectifyFactory';

import ChatGPT from '../lib/connectors/AI/ChatGPT';
import TensorFlowNode from '../lib/connectors/AI/TensorFlowNode';

describe("AIConnectifyFactory function", () => {
    it("Tests if getAIInstance returns the correct instance for a supported AI with apiKey", () => {
        const aiInstance = getAIInstance("ChatGPT", "testApiKey");
        expect(aiInstance).toBeInstanceOf(ChatGPT);
    });
    it("Tests if getAIInstance returns the correct instance for a supported AI without apiKey", () => {
        const aiInstance = getAIInstance("TensorFlowNode");
        expect(aiInstance).toEqual(expect.any(Object));
        
    });
});

describe("AIConnectifyError is throw in getAIInstance function", () => {
    it("Tests is thrown error when AI parameter is missing", () => {
        expect(() => getAIInstance()).toThrow(AIConnectifyError);
    });
    it("Tests is thrown error when an invalid AI parameter is provided", () => {
        expect(() => getAIInstance("testInvalidAI")).toThrow(AIConnectifyError);
    });
    it("Tests is thrown error if an apiKey is required but not provided", () => {
        expect(() => getAIInstance("ChatGPT")).toThrow(AIConnectifyError);
    });
});