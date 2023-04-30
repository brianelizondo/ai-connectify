import AIConnectifyError from '../lib/AIConnectifyError';
import AIConnectify from '../lib/ai-connectify';

const testValidAI = "TensorFlow";
const testInvalidAI = "invalidAI";
const testApiKey = "acb123";

describe("AIConnectify class", () => {
    it("Tests if created with a valid AI and without apiKey parameters", () => {
        const aiConnectify = new AIConnectify(testValidAI);
        expect(aiConnectify).toBeInstanceOf(AIConnectify);
    });
    it("Tests if created with a valid AI and apiKey parameters", () => {
        const aiConnectify = new AIConnectify(testValidAI, testApiKey);
        expect(aiConnectify).toBeInstanceOf(AIConnectify);
    });
});

describe("AIConnectifyError is throw in AIConnectify class", () => {
    it("Tests is thrown error when AI parameter is missing", () => {
        expect(() => new AIConnectify()).toThrow(AIConnectifyError);
    });
    it("Tests is thrown error when an invalid AI parameter is provided", () => {
        expect(() => new AIConnectify(testInvalidAI)).toThrow(AIConnectifyError);
    });
});