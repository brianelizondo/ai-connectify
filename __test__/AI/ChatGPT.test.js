import AIConnectifyError from '../../lib/AIConnectifyError';
import ChatGPT from '../../lib/connectors/AI/ChatGPT';

const chatGPT = new ChatGPT("OPEN-AI-KEY");

describe("TensorFlow AI class", () => { 
    describe("Successful test cases", () => { 
        it("Tests if listModels function returns the list of models", async () => {
            const listModels = await chatGPT.listModels();
            expect(listModels).toEqual(expect.any(Array));
        });
    
        it("Tests if reatrieveModel function returns the list of models", async () => {
            const modelDetails = await chatGPT.reatrieveModel("text-davinci-003");
            expect(modelDetails).toEqual(expect.any(Object));
        });
    
        it("Tests if createCompletion function returns the expected completion", async () => {
            const completion = await chatGPT.createCompletion("Say this is a test");
            expect(completion).toEqual(expect.any(String));
        });
        it("Tests if createCompletion can handle a null config parameter", async () => {
            const completion = await chatGPT.createCompletion("Say this is a test", null);
            expect(completion).toEqual(expect.any(String));
        });
    
        it("Tests if createChatCompletion function returns the expected array", async () => {
            const messages = [{role: "user", content: "Hello world"}]
            const chatCompletion = await chatGPT.createChatCompletion(messages);
            expect(chatCompletion).toEqual(expect.any(Array));
        });
    
        it("Tests if createEdit function returns an edited version of the prompt", async () => {
            const editedPrompt = await chatGPT.createEdit("Fix the spelling mistakes");
            expect(editedPrompt).toEqual(expect.any(String));
        });
        it("Tests if createEdit function returns an edited version of the prompt with input field", async () => {
            const editedPrompt = await chatGPT.createEdit("Fix the spelling mistakes", "What day of the wek is it?");
            expect(editedPrompt).toEqual(expect.any(String));
        });
        it("Tests if createEdit can handle a null input parameter", async () => {
            const editedPrompt = await chatGPT.createEdit("Fix the spelling mistakes", null);
            expect(editedPrompt).toEqual(expect.any(String));
        });
    });

    describe("AIConnectifyError is throw in methods", () => { 
        it("Tests is thrown error in reatrieveModel function when the model id is an empty string", async () => {
            await expect(chatGPT.reatrieveModel()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPT.reatrieveModel("")).rejects.toThrow(AIConnectifyError);
        });
        it("Tests is thrown error in createCompletion function when the prompt is an empty string", async () => {
            await expect(chatGPT.createCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPT.createCompletion("")).rejects.toThrow(AIConnectifyError);
        });
        it("Tests is thrown error in createChatCompletion function when the messages is an empty array", async () => {
            await expect(chatGPT.createChatCompletion()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPT.createChatCompletion([])).rejects.toThrow(AIConnectifyError);
        });
        it("Tests is thrown error in createEdit function when the instruction is an empty string", async () => {
            await expect(chatGPT.createEdit()).rejects.toThrow(AIConnectifyError);
            await expect(chatGPT.createEdit("")).rejects.toThrow(AIConnectifyError);
        });
    });
});