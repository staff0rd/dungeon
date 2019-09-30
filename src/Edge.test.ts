import { Edge } from "./Edge";
import { Rect } from "./core/Rect";
import { Structure } from "./Structure";
import { Direction } from "./core/Direction";

describe ("Edge", () => {
    describe('insert', () => {
        test('should trim overlaps', () => {
            const edge = new Edge(new Rect(0, 0, 10, 1), Direction.Bottom, Structure.Corridor);
            edge.insert(0, 1, Structure.Corridor);
            expect(edge.segments.length).toBe(1);
            expect(edge.segments[0].from).toBe(1);
        });
    });
});

