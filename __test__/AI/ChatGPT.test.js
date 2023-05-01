import AIConnectifyError from '../../lib/AIConnectifyError';
import ChatGPT from '../../lib/connectors/AI/ChatGPT';

const chatGPT = new ChatGPT("OPEN-AI-APIKEY");

describe("ChatGPT AI class", () => { 
    it("Tests if createCompletion function returns the expected completion", async () => {
        const completion = await chatGPT.createCompletion("Hello, who are you?");
        expect(completion).toEqual(expect.any(String));
    });
    it("Tests if createCompletion function can handle a very long prompt", async () => {
        const longPrompt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.";
        const completion = await chatGPT.createCompletion(longPrompt);
        expect(completion).toEqual(expect.any(String));
    });
    it("Tests if createCompletion can handle a null config parameter", async () => {
        const completion = await chatGPT.createCompletion("Hello, who are you?", null);
        expect(completion).toEqual(expect.any(String));
    });
});

describe("AIConnectifyError is throw in ChatGPT AI class", () => {
    it("Tests is thrown error when the prompt is an empty string", async () => {
        await expect(chatGPT.createCompletion("")).rejects.toThrow(AIConnectifyError);
    });
});