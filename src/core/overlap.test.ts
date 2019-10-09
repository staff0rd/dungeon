import { overlap } from "./overlap";

describe("overlap", () => {
    test('before', () => {
        const result = overlap(1, 2, 2, 3);
        expect(result).toBe(false);
    });
    test('after', () => {
        const result = overlap(2, 3, 1, 2);
        expect(result).toBe(false);
    })
    test('overlap starting inside going after', () => {
        const result = overlap (1, 3, 2, 4);
        expect(result).toBe(true);
    })
    test('overlap starting before', () => {
        const result = overlap (2, 4, 1, 3);
        expect(result).toBe(true);
    })
})