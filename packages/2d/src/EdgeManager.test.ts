import { EdgeManager } from "./EdgeManager";
import { Edge } from "./Edge";
import { Direction } from "./core/Direction";
import { CorridorView } from "./CorridorView";
import { Rect } from "./core/Rect";
import { DungeonMap } from "./DungeonMap";
import { Config } from "./Config";
import { Structure } from "./Structure";

describe("EdgeManager", () => {
  const manager = new EdgeManager((x, y) => true);

  describe("join", () => {
    test("should join continuous edges", () => {
      const edges = [
        new Edge(new Rect(1, 0, 1, 1), Direction.Top, Structure.Room),
        new Edge(new Rect(2, 0, 1, 1), Direction.Top, Structure.Room),
      ];
      const result = manager.join(edges);
      expect(result.length).toBe(1);
      expect(result[0].start).toBe(1);
      expect(result[0].end).toBe(3);
    });
    test("should join continuous edges (reverse)", () => {
      const edges = [
        new Edge(new Rect(2, 0, 1, 1), Direction.Top, Structure.Room),
        new Edge(new Rect(1, 0, 1, 1), Direction.Top, Structure.Room),
      ];
      const result = manager.join(edges);
      expect(result.length).toBe(1);
      expect(result[0].start).toBe(1);
      expect(result[0].end).toBe(3);
    });
    test("should retain splits", () => {
      const edge1 = manager.getCorridorEdge(
        <CorridorView>{ rect: new Rect(5, 5, 10, 1) },
        [],
        [new Rect(6, 4, 1, 1)],
        Direction.Top
      );
      expect(edge1.segments.length).toBe(2);
      const edge2 = manager.getCorridorEdge(
        <CorridorView>{ rect: new Rect(4, 5, 1, 1) },
        [],
        [],
        Direction.Top
      );
      expect(edge2.segments.length).toBe(1);

      var result = manager.join([edge1, edge2]);
      expect(result.length).toBe(1);
      expect(result[0].segments.length).toBe(2);
    });
  });
  describe("getCorridorEdge", () => {
    test("should split by adjacent corridors", () => {
      const edge = manager.getCorridorEdge(
        <CorridorView>{ rect: new Rect(5, 5, 10, 1) },
        [],
        [new Rect(6, 4, 1, 1)],
        Direction.Top
      );

      expect(edge.segments.length).toBe(2);
    });
    test("shoud join seed 95168 corridors 12 & 13 correctly", () => {
      const result = getMapEdges(95168, Direction.Top, (r) => r.top == 28);
      expect(result.joined.length).toBe(1);
    });
    test("shoud split seed 95168 corridor 17 correctly", () => {
      const result = getMapEdges(95168, Direction.Top, (r) => r.top == 26);
      expect(result.joined.length).toBe(2);
    });
    test("should remove segments that end on corridors", () => {
      const result = getMapEdges(95168, Direction.Top, (r) => r.top == 2);
      expect(result.joined.length).toBe(0);
    });
    test("should trim segments that overlaps", () => {
      const result = getMapEdges(95168, Direction.Bottom, (r) => r.bottom == 2);
      result.joined.forEach((e) => console.log(e.toString()));
      expect(result.joined.length).toBe(1);
    });
  });
});

function getMapEdges(
  seed: number,
  direction: Direction,
  selectEdge: (r: Rect) => boolean,
  width = 60,
  height = 30
) {
  const config = <Config>{ width, height };
  const map = new DungeonMap(config);
  const edgeManager = new EdgeManager((x, y) => map.isTraversable(x, y));
  map.setSeed(seed);
  map.createMap();
  map.buildCorridors();
  const edges = map.corridors.map((corridor) =>
    edgeManager.getCorridorEdge(
      corridor,
      [],
      map.corridors.map((c) => c.rect),
      direction
    )
  );
  const joined = edgeManager.join(edges);
  return {
    edges: edges.filter((e) => selectEdge(e.rect)),
    joined: joined.filter((e) => selectEdge(e.rect)),
  };
}
