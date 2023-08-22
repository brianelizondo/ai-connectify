import AIConnectifyError from '../../lib/AIConnectifyError';
import Cohere from '../../lib/connectors/AI/Cohere';

const cohere = new Cohere("wskRBT7chFEJIzpx27QOP7JCgVbpA1gDAtUryre5");

const classifyInputsArray = ['Confirm your email address', 'hey i need u to send some $'];
const classifyExamplesArray = [
    { text: 'Dermatologists don\'t like her!', label: 'Spam'},
    { text: 'Hello, open to this?', label: 'Spam'},
    { text: 'I need help please wire me $1000 right now', label: 'Spam'},
    { text: 'Nice to know you ;)', label: 'Spam'},
    { text: 'Please help me?', label: 'Spam'},
    { text: 'Your parcel will be delivered today', label: 'Not spam'},
    { text: 'Review changes to our Terms and Conditions', label: 'Not spam'},
    { text: 'Weekly sync notes', label: 'Not spam'},
    { text: 'Re: Follow up from today meeting', label: 'Not spam'},
    { text: 'Pre-read for tomorrow', label: 'Not spam'}
];
const summarizeTextExample = 'Ice cream is a sweetened frozen food typically eaten as a snack or dessert. It may be made from milk or cream and is flavoured with a sweetener, either sugar or an alternative, and a spice, such as cocoa or vanilla, or with fruit such as strawberries or peaches. It can also be made by whisking a flavored cream base and liquid nitrogen together. Food coloring is sometimes added, in addition to stabilizers. The mixture is cooled below the freezing point of water and stirred to incorporate air spaces and to prevent detectable ice crystals from forming. The result is a smooth, semi-solid foam that is solid at very low temperature (below 2 °C or 35 °F).';

describe("Cohere AI class", () => { 
    describe("Successful test cases", () => {
        it("Tests if the generate function returns realistic text when given a valid prompt", async () => {
            const response = await cohere.generate("Say if this is a test", "command-light");
            
            expect(response).toEqual(expect.any(String));
        });
    
        it("Tests if the embed function returns an array of strings for the model to embed", async () => {
            const response = await cohere.embed(["hello", "goodbye"], "embed-english-light-v2.0");
            
            expect(response).toEqual(expect.any(Array));
            expect(response[0][0]).toEqual(expect.any(Number));
        });
    
        it("Tests if the classify function returns an array of objects", async () => {
            const response = await cohere.classify(classifyInputsArray, classifyExamplesArray, "embed-english-light-v2.0");
            
            expect(response).toEqual(expect.any(Array));
            expect(response[0].input).toEqual(classifyInputsArray[0]);
            expect(response[0].confidence).toEqual(expect.any(Number));
            expect(response[0].labels).toEqual(expect.any(Object));
        });
    
        it("Tests if the tokenize function returns splits input text into smaller units", async () => {
            const response = await cohere.tokenize("tokenize me! :D", "command-light");
            
            expect(response).toEqual(expect.any(Object));
            expect(response.tokens).toEqual(expect.any(Array));
            expect(response.tokens[0]).toEqual(expect.any(Number));
            expect(response.token_strings).toEqual(expect.any(Array));
            expect(response.token_strings[0]).toEqual(expect.any(String));
        });
    
        it("Tests if the detokenize function returns text representation", async () => {
            const response = await cohere.detokenize([10104, 12221, 1315, 34, 1420, 69], "command-light");
            expect(response).toEqual(expect.any(String));
        });
    
        it("Tests if the detectLanguage function returns identifies which language each of the provided texts", async () => {
            const response = await cohere.detectLanguage(["Hello how are you?", "Hola, como estas?", "Bonjour, comment allez-vous?"]);
            
            expect(response.length).toEqual(3);
            expect(response[0].language_code).toEqual("en");
            expect(response[1].language_code).toEqual("es");
            expect(response[2].language_code).toEqual("fr");
        });
    
        it("Tests if the summarize function returns a summary for a given text", async () => {
            const response = await cohere.generate(summarizeTextExample, "command-light");
            expect(response).toEqual(expect.any(String));
        });
    });


    describe("AIConnectifyError is throw in methods", () => {
        describe("Throw error in 'generate' method", () => {
            it("Tests when the prompt is empty or not a string", async () => {
                await expect(cohere.generate()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.generate("")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.generate(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.generate("Say if this is a test", "invalid-model-name")).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'embed' method", () => {
            it("Tests when the text is empty or not an array", async () => {
                await expect(cohere.embed()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.embed([])).rejects.toThrow(AIConnectifyError);
                await expect(cohere.embed({ text: "is not an array" })).rejects.toThrow(AIConnectifyError);
                await expect(cohere.embed("is not an array")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.embed(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.generate(["hello", "goodbye"], "invalid-model-name")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.generate(["hello", "goodbye"], 123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'classify' method", () => {
            it("Tests when the input is empty or not an array", async () => {
                await expect(cohere.classify()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify([])).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify("is not an array")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when the example is empty or not an array", async () => {
                await expect(cohere.classify(classifyInputsArray)).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify(classifyInputsArray, [])).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify(classifyInputsArray, "is not an array")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.classify(classifyInputsArray, 123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.classify(classifyInputsArray, classifyExamplesArray, 123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'tokenize' method", () => {
            it("Tests when the text is empty or not a string", async () => {
                await expect(cohere.tokenize()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.tokenize("")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.tokenize([])).rejects.toThrow(AIConnectifyError);
                await expect(cohere.tokenize({ text: "is not a string" })).rejects.toThrow(AIConnectifyError);
                await expect(cohere.tokenize(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.tokenize("tokenize me! :D", 123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'detokenize' method", () => {
            it("Tests when the tokens is empty or not an array", async () => {
                await expect(cohere.detokenize()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detokenize("")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detokenize({ tokens: "is not an array" })).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detokenize(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.generate([10104, 12221, 1315, 34, 1420, 69], "invalid-model-name")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.tokenize([10104, 12221, 1315, 34, 1420, 69], 123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'detectLanguage' method", () => {
            it("Tests when the texts is empty or not an array", async () => {
                await expect(cohere.detectLanguage()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detectLanguage("")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detectLanguage({ texts: "is not an array" })).rejects.toThrow(AIConnectifyError);
                await expect(cohere.detectLanguage(123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    
        describe("Throw error in 'summarize' method", () => {
            it("Tests when the text is empty or not a string", async () => {
                await expect(cohere.summarize()).rejects.toThrow(AIConnectifyError);
                await expect(cohere.summarize("")).rejects.toThrow(AIConnectifyError);
                await expect(cohere.summarize([])).rejects.toThrow(AIConnectifyError);
                await expect(cohere.summarize({ text: "is not a string" })).rejects.toThrow(AIConnectifyError);
                await expect(cohere.summarize(123456)).rejects.toThrow(AIConnectifyError);
            });
            it("Tests when set an invalid model name", async () => {
                await expect(cohere.summarize(summarizeTextExample, 123456)).rejects.toThrow(AIConnectifyError);
            });
        });
    });
});