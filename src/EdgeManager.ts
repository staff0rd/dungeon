import { Structure } from "./Structure";
import { between } from "./between";
import { Rect } from "./core/Rect";
import { RoomView } from "./RoomView";
import { CorridorView } from "./CorridorView";
import { Edge } from "./Edge";
import { Direction } from "./Direction";
import { getDoors } from "./getDoors";
export class EdgeManager {
    getRoomEdge(room: RoomView, corridors: CorridorView[], direction: Direction) {
        const rects = getDoors(room).concat(corridors.map(c => c.rect));
        return this.getSegments(room.rect, rects, direction);
    }
    getCorridorEdge(corridor: CorridorView, rooms: RoomView[], direction: Direction) {
        const doors = rooms.map(r => getDoors(r));
        const rects = rooms.map(r => r.rect)
            .concat([].concat(...doors));
        return this.getSegments(corridor.rect, rects, direction);
    }
    private getSegments(baseRect: Rect, rects: Rect[], direction: Direction) {
        let edge: Edge, intersections: Rect[], edgeInserter: (rect: Rect) => void;
        switch (direction) {
            case Direction.East:
            case Direction.West: {
                edge = new Edge(baseRect.y1, baseRect.y2, Structure.Room);
                edgeInserter = (rect: Rect) => edge.insert(rect.y1, rect.y2, Structure.Corridor);
                intersections = rects.filter(rect => rect.height == 1 && between(rect.y1, baseRect.y1, baseRect.y2));
                break;
            }
            case Direction.North:
            case Direction.South: {
                edge = new Edge(baseRect.x1, baseRect.x2, Structure.Room);
                edgeInserter = (rect: Rect) => edge.insert(rect.x1, rect.x2, Structure.Corridor);
                intersections = rects.filter(rect => rect.width == 1 && between(rect.x1, baseRect.x1, baseRect.x2));
                break;
            }
        }
        switch (direction) {
            case Direction.East: {
                intersections = intersections.filter(rect => rect.x1 == baseRect.x2);
                break;
            }
            case Direction.West: {
                intersections = intersections.filter(rect => rect.x2 == baseRect.x1);
                break;
            }
            case Direction.North: {
                intersections = intersections.filter(rect => rect.y2 == baseRect.y1);
                break;
            }
            case Direction.South: {
                intersections = intersections.filter(rect => rect.y1 == baseRect.y2);
                break;
            }
        }
        intersections.forEach(edgeInserter);
        return edge;
    }
}
