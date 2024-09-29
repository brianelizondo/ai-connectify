import AIConnectifyError from '../lib/AIConnectifyError';

describe("AIConnectifyError Class", () => {
    describe("Throw new error", () => {
        it("Test create an instance with a specific message", () => {
            const errorMessage = 'This is a specific error message';
            const errorInstance = new AIConnectifyError(errorMessage);
            expect(errorInstance).toBeInstanceOf(AIConnectifyError);
            expect(errorInstance.message).toBe(errorMessage);
            expect(errorInstance.name).toBe('AIConnectifyError');
        });
        it("Test create an instance with an empty string as the message", () => {
            const errorMessage = '';
            const errorInstance = new AIConnectifyError(errorMessage);
            expect(errorInstance).toBeInstanceOf(AIConnectifyError);
            expect(errorInstance.message).toBe(errorMessage);
            expect(errorInstance.name).toBe('AIConnectifyError');
        });
    });
})