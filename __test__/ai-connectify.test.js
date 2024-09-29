import AIConnectifyError from '../lib/AIConnectifyError';
import AIConnectify from '../lib/ai-connectify';

const testValidAI = "TensorFlow";
const testInvalidAI = "invalidAI";
const testApiKey = "acb123";

describe("AIConnectify Class", () => {
    describe("Create new instance", () => {
        it("Tests if created with a valid AI and without apiKey parameters", () => {
            const aiConnectify = new AIConnectify(testValidAI);
            expect(aiConnectify).toBeInstanceOf(AIConnectify);
        });
        it("Tests if created with a valid AI and apiKey parameters", () => {
            const aiConnectify = new AIConnectify(testValidAI, testApiKey);
            expect(aiConnectify).toBeInstanceOf(AIConnectify);
        });
    });
    
    describe("Use the 'call' method", () => {
        it("Tests use valid method call", async () => {
            const aiConnectify = new AIConnectify(testValidAI);
            const newTensor = await aiConnectify.call("tensor", [1, 2, 3, 4]);
            expect(newTensor).toEqual(expect.any(Object));
            expect(newTensor.size).toEqual(4);
        });
      });
    describe("Throw the AIConnectifyError error", () => {
        it("Tests when AI parameter is missing", () => {
            expect(() => new AIConnectify()).toThrow(AIConnectifyError);
        });
        it("Tests when an invalid AI parameter is provided", () => {
            expect(() => new AIConnectify(testInvalidAI)).toThrow(AIConnectifyError);
        });
        it("Tests when use invalid method call", async () => {
            const aiConnectify = new AIConnectify(testValidAI);
            await expect(aiConnectify.call("nonExistentMethod")).rejects.toThrow(AIConnectifyError);
        });
    
        it("Tests error handling", async () => {
            const aiConnectify = new AIConnectify(testValidAI);
            aiConnectify.connector.methodThatThrowsError = jest.fn().mockImplementation(() => {
                throw new Error("Simulated error");
            });
    
            await expect(aiConnectify.call("methodThatThrowsError")).rejects.toThrow(Error);
        });
    });
})
