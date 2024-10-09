export = ValidationHelpers;
/**
* Represents a ValidationHelpers instance
* A collection of utility methods for input validation
* @class ValidationHelpers
*/
declare class ValidationHelpers {
    /**
    * Validates a string input to ensure it is not empty or whitespace-only
    * @static
    * @param {string} inputString - The input string to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateStringInput(inputString: string, errorMessage: string): void;
    /**
    * Validates a number input to ensure it is not empty or NaN
    * @static
    * @param {number} inputNumber - The input number to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateNumberInput(inputNumber: number, errorMessage: string): void;
    /**
    * Validates an array input to ensure it is not empty and is an actual array
    * @static
    * @param {Array} inputArray - The input array to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateArrayInput(inputArray: any[], errorMessage: string): void;
    /**
    * Validates an string to ensure it is a valid Key format
    * @static
    * @param {string} keyString - The key string to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateKeyString(keyString: string, errorMessage: string): void;
    /**
    * Validates if the value is boolean
    * @static
    * @param {string} value - The value to validate
    * @param {string} errorMessage - The error message to throw if validation fails
    * @throws {AIConnectifyError} - Throws an error if validation fails
    */
    static validateBooleanInput(value: string, errorMessage: string): void;
}
