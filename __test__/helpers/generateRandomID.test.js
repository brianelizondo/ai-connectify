import { generateRandomID } from '../../lib/helpers/generateId';


describe("generateRandomID function", () => {
    it("Test if generate a 16-character lenght ID", () => {
        const newID = generateRandomID();
        expect(newID).toHaveLength(16);
    });
    it("Test if generate alphanumeric ID", () => {
        const newID = generateRandomID();
        expect(newID).toMatch(/^[A-Za-z0-9]+$/);
    });
})
