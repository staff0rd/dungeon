import { Structure } from "./Structure";
import { overlap } from "./overlap";
import { Rect } from "./core/Rect";
import { RoomView } from "./RoomView";
import { CorridorView } from "./CorridorView";
import { Edge } from "./Edge";
import { Direction } from "./core/Direction";
import { getDoors } from "./getDoors";
export class EdgeManager {

    private canTraverse: (x: number, y: number) => boolean;

    constructor(canTraverse: (x: number, y: number) => boolean) {
        this.canTraverse = canTraverse;
    }
    
    getRoomEdge(room: RoomView, corridors: CorridorView[], direction: Direction) {
        const rects = getDoors(room).concat(corridors.map(c => c.rect));
        return this.getEdge(room.rect, rects, direction);
    }
    getCorridorEdge(corridor: CorridorView, rooms: RoomView[], corridorRects: Rect[], direction: Direction) {
        const doors = rooms.map(r => getDoors(r));
        const corridorsToCheckIntersect = corridorRects.filter(c => !corridor.rect.equals(c));
        const rects = rooms.map(r => r.rect)
            .concat([].concat(...doors))
            .concat(corridorsToCheckIntersect);
        const edge = this.getEdge(corridor.rect, rects, direction);
        return edge;
    }

    getCorridorEdges(corridors: CorridorView[], direction: Direction, rooms: RoomView[]) {
        let edges = corridors
            .map(corridor => this.getCorridorEdge(corridor, rooms, corridors.map(c => c.rect), direction));
        return this.join(edges);
    }

    private getEdge(baseRect: Rect, rects: Rect[], direction: Direction) {
        let edge: Edge, intersections: Rect[], edgeInserter: (rect: Rect) => void;
        switch (direction) {
            case Direction.Right:
            case Direction.Left: {
                edge = new Edge(baseRect, direction, Structure.Room);
                edgeInserter = (rect: Rect) => edge.insert(rect.y1, rect.y2, Structure.Corridor);
                intersections = rects.filter(rect => rect.height == 1 && overlap(rect.y1, rect.y2, baseRect.y1, baseRect.y2));
                break;
            }
            case Direction.Top:
            case Direction.Bottom: {
                edge = new Edge(baseRect, direction, Structure.Room);
                edgeInserter = (rect: Rect) => edge.insert(rect.x1, rect.x2, Structure.Corridor);
                intersections = rects.filter(rect => overlap(rect.x1, rect.x2, baseRect.x1, baseRect.x2));
                break;
            }
        }
        switch (direction) {
            case Direction.Right: {
                intersections = intersections.filter(rect => rect.x1 == baseRect.x2);
                break;
            }
            case Direction.Left: {
                intersections = intersections.filter(rect => rect.x2 == baseRect.x1);
                break;
            }
            case Direction.Top: {
                intersections = intersections.filter(rect => rect.y2 == baseRect.y1);
                break;
            }
            case Direction.Bottom: {
                intersections = intersections.filter(rect => rect.y1 == baseRect.y2);
                break;
            }
        }
        intersections.forEach(edgeInserter);
        return edge;
    }

    join(edges: Edge[], debugFocusOn: (r: Rect) => boolean = undefined): Edge[] {
        if (edges.length == 1)
            return edges;
        edges = edges.filter(e => e.segmentPoints.length);
        for (let i = 0; i < edges.length;i++) {
            const first = edges[i];
            const notEqual = edges.filter(e => !e.rect.equals(first.rect));
            const aligned = notEqual.filter(e => e.rect.aligned(first.rect, first.direction))// && e.direction == first.direction);
            const joining = aligned.filter(e => e.start == first.end || e.end == first.start);
            if (debugFocusOn && !debugFocusOn(first.rect))
                continue;
            //console.log(`first: ${first.toString()}, all: ${edges.length}, notEqual: ${notEqual.length}, aligned: ${aligned.length}, joining: ${joining.length}, ${first.rect.top}`);
            const second = joining[0];

            if (second) {
                //console.log('second', second.toString());
                //console.log('before', first.toString(), second.toString());
                if (first.end == second.start) {
                    first.join(second);
                    //console.log('after', first.toString(), second.toString());
                    edges.splice(edges.indexOf(second), 1);
                } else {
                    second.join(first);
                    //console.log('after', first.toString(), second.toString());
                    edges.splice(edges.indexOf(first), 1);
                }
                return this.join(edges);
            }
        }
        return edges;
    }
}
