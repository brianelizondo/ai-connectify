import AIConnectifyError from '../../lib/AIConnectifyError';
import DALLE from '../../lib/connectors/AI/DALLE';

const dallE = new DALLE("OPEN-AI-KEY");
const dallePromptTest = "A cute baby sea otter";

describe("TensorFlow AI class", () => { 
    describe("Successful test cases", () => { 
        it("Tests if listModels function returns the list of models", async () => {
            const listModels = await dallE.listModels();
            expect(listModels).toEqual(expect.any(Array));
        });
    
        it("Tests if reatrieveModel function returns the list of models", async () => {
            const modelDetails = await dallE.reatrieveModel("text-davinci-003");
            expect(modelDetails).toEqual(expect.any(Object));
        });
    
        it("Tests if createImage function returns array with url's of the new image created", async () => {
            jest.setTimeout(10000);
            const newImage = await dallE.createImage(dallePromptTest);
            expect(newImage).toEqual(expect.any(Array));
        });
    });

    describe("AIConnectifyError is throw in methods", () => { 
        it("Tests is thrown error in reatrieveModel function when the model id is an empty string", async () => {
            await expect(dallE.reatrieveModel()).rejects.toThrow(AIConnectifyError);
            await expect(dallE.reatrieveModel("")).rejects.toThrow(AIConnectifyError);
        });

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
});