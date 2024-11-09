import AIConnectifyError from '../../lib/AIConnectifyError';
import HelperFunctions from '../../lib/helpers/HelperFunctions';


describe("HelperFunctions Class", () => {
    describe("Create new instance", () => {
        it("Tests if the instance is created correctly", () => {
            const vh = new HelperFunctions();
            expect(vh).toBeInstanceOf(HelperFunctions);
        });
    });
    
    describe("Use the class method", () => {
        it("Tests if 'validateStringInput' receive a correct string", async () => {
            expect(() => HelperFunctions.validateStringInput('valid string')).not.toThrow();
        });
        it("Tests if 'validateNumberInput' receive a correct number", async () => {
            expect(() => HelperFunctions.validateNumberInput(123456)).not.toThrow();
        });
        it("Tests if 'validateArrayInput' receive a correct array", async () => {
            expect(() => HelperFunctions.validateArrayInput([1,2,3,4,5])).not.toThrow();
        });
        it("Tests if 'validateBooleanInput' receive a correct boolean", async () => {
            expect(() => HelperFunctions.validateBooleanInput(true)).not.toThrow();
        });
        it("Tests if 'validateKeyString' receive a correct key string", async () => {
            expect(() => HelperFunctions.validateKeyString('sk-abcdeABCDE12345')).not.toThrow();
        });
        it("Tests if 'generateRandomID' return a new random ID", async () => {
            const randomId = HelperFunctions.generateRandomID();
            expect(typeof randomId).toBe('string');
            expect(randomId.length).toEqual(16)
        });
        it("Tests if 'validateAndReturnPath' return a valid path string", async () => {
            const validPath = HelperFunctions.validateAndReturnPath('/lib');
            expect(typeof validPath).toBe('string');
        });
    });
    describe("Throw the AIConnectifyError error", () => {
        describe("Using the 'validateStringInput' method", () => {
            it("Tests when an empty strings is provided", () => {
                expect(() => HelperFunctions.validateStringInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-string is provided", () => {
                expect(() => HelperFunctions.validateStringInput(123)).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateNumberInput' method", () => {
            it("Tests when an empty number is provided", () => {
                expect(() => HelperFunctions.validateNumberInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-number is provided", () => {
                expect(() => HelperFunctions.validateNumberInput('12345')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateArrayInput' method", () => {
            it("Tests when an empty array is provided", () => {
                expect(() => HelperFunctions.validateArrayInput([])).toThrow(AIConnectifyError);
            });
            it("Tests when an non-array is provided", () => {
                expect(() => HelperFunctions.validateArrayInput('12345')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateBooleanInput' method", () => {
            it("Tests when an empty boolean is provided", () => {
                expect(() => HelperFunctions.validateBooleanInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-boolean is provided", () => {
                expect(() => HelperFunctions.validateBooleanInput('true')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateKeyString' method", () => {
            it("Tests when an empty key string is provided", () => {
                expect(() => HelperFunctions.validateKeyString()).toThrow(AIConnectifyError);
            });
            it("Tests when an non key string is provided", () => {
                expect(() => HelperFunctions.validateKeyString('sk*123465/ABC')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateAndReturnPath' method", () => {
            it("Tests when a path string provided dont exist", () => {
                expect(() => HelperFunctions.validateAndReturnPath('/bad-path')).toThrow(AIConnectifyError);
            });
        });
    });
})
