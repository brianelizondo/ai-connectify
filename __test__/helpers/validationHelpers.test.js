import AIConnectifyError from '../../lib/AIConnectifyError';
import ValidationHelpers from '../../lib/helpers/validationHelpers';


describe("validationHelpers Class", () => {
    describe("Create new instance", () => {
        it("Tests if the instance is created correctly", () => {
            const vh = new ValidationHelpers();
            expect(vh).toBeInstanceOf(ValidationHelpers);
        });
    });
    
    describe("Use the class method", () => {
        it("Tests if 'validateStringInput' receive a correct string", async () => {
            expect(() => ValidationHelpers.validateStringInput('valid string')).not.toThrow();
        });
        it("Tests if 'validateNumberInput' receive a correct number", async () => {
            expect(() => ValidationHelpers.validateNumberInput(123456)).not.toThrow();
        });
        it("Tests if 'validateArrayInput' receive a correct array", async () => {
            expect(() => ValidationHelpers.validateArrayInput([1,2,3,4,5])).not.toThrow();
        });
        it("Tests if 'validateBooleanInput' receive a correct boolean", async () => {
            expect(() => ValidationHelpers.validateBooleanInput(true)).not.toThrow();
        });
        it("Tests if 'validateKeyString' receive a correct key string", async () => {
            expect(() => ValidationHelpers.validateKeyString('sk-abcdeABCDE12345')).not.toThrow();
        });
    });
    describe("Throw the AIConnectifyError error", () => {
        describe("Using the 'validateStringInput' method", () => {
            it("Tests when an empty strings is provided", () => {
                expect(() => ValidationHelpers.validateStringInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-string is provided", () => {
                expect(() => ValidationHelpers.validateStringInput(123)).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateNumberInput' method", () => {
            it("Tests when an empty number is provided", () => {
                expect(() => ValidationHelpers.validateNumberInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-number is provided", () => {
                expect(() => ValidationHelpers.validateNumberInput('12345')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateArrayInput' method", () => {
            it("Tests when an empty array is provided", () => {
                expect(() => ValidationHelpers.validateArrayInput([])).toThrow(AIConnectifyError);
            });
            it("Tests when an non-array is provided", () => {
                expect(() => ValidationHelpers.validateArrayInput('12345')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateBooleanInput' method", () => {
            it("Tests when an empty boolean is provided", () => {
                expect(() => ValidationHelpers.validateBooleanInput()).toThrow(AIConnectifyError);
            });
            it("Tests when an non-boolean is provided", () => {
                expect(() => ValidationHelpers.validateBooleanInput('true')).toThrow(AIConnectifyError);
            });
        });
        describe("Using the 'validateKeyString' method", () => {
            it("Tests when an empty key string is provided", () => {
                expect(() => ValidationHelpers.validateKeyString()).toThrow(AIConnectifyError);
            });
            it("Tests when an non key string is provided", () => {
                expect(() => ValidationHelpers.validateKeyString('sk*123465/ABC')).toThrow(AIConnectifyError);
            });
        });
    });
})
