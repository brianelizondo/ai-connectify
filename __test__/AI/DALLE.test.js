import AIConnectifyError from '../../lib/AIConnectifyError';
import DALLE from '../../lib/connectors/AI/DALLE';

const dallE = new DALLE("OPEN-AI-APIKEY");
const dallePromptTest = "a white siamese cat";
const dalleTestConfig = {
    n: 1,
    size: "256x256",
    response_format: "url"
}

describe("DALLE AI class", () => { 
    it("Tests if createCompletion function returns the expected completion", async () => {
        jest.setTimeout(10000);
        const response = await dallE.createImage(dallePromptTest, dalleTestConfig);
        expect(response).toEqual(expect.any(URL));
    });
});

describe("AIConnectifyError is throw in DALLE AI class", () => {
    it("Tests is thrown error in createImage function when the prompt is an empty string", async () => {
        await expect(dallE.createImage("")).rejects.toThrow(AIConnectifyError);
    });
    it("Tests is thrown error in createImageEdit function when the image is empty", async () => {
        await expect(dallE.createImageEdit("", "prompt test")).rejects.toThrow(AIConnectifyError);
    });
    it("Tests is thrown error in createImageEdit function when the prompt is an empty string", async () => {
        await expect(dallE.createImageEdit("imageTest", "")).rejects.toThrow(AIConnectifyError);
    });
    it("Tests is thrown error in createImageVariation function when the image is empty", async () => {
        await expect(dallE.createImageVariation("")).rejects.toThrow(AIConnectifyError);
    });
});