import { Map } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils, Color} from './core/Colors'
import { Structure } from "./Structure";
import { between } from "./between";
import { Point } from "./core/Point";
import { Rect } from "./core/Rect";
import { RoomView } from "./RoomView";
import { CorridorView } from "./CorridorView";
import { Edge } from "./Edge";
import { Tip } from "./Tip";
import { Segment } from "./Segment";
import { Direction } from "./Direction";
import { WallBuilder } from './WallBuilder';

const ROOM_SHADE_INDEX = 3;

export class DungeonMap {
    view: PIXI.Container;
    data: Point<number>[];
    rooms: RoomView[];
    corridors: CorridorView[];
    private map: Dungeon;
    private width: number;
    private height: number;
    private walls: PIXI.Container;
    private showRoomNumbers: boolean;
    private scale: number;
    private hideWalls: boolean;
    private wallBuilder: WallBuilder;

    constructor(width: number, height: number, showRoomNumbers: boolean, scale: number, hideWalls: boolean) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.wallBuilder = new WallBuilder(this.scale);
        this.showRoomNumbers = showRoomNumbers;
        this.hideWalls = hideWalls;
        this.view = new PIXI.Container();
    }

    generate() {
        this.view.removeChildren();

        this.map = new Map.Digger(this.width, this.height, {});
        this.data = [];
        this.map.create((x: number, y: number, value: number ) => {
            this.data.push({x, y, value});
        });

        this.rooms = this.map.getRooms().map((room, ix) => {
            const x = room.getLeft();
            const y = room.getTop();
            const width = room.getRight() - x + 1;
            const height = room.getBottom() - y + 1;
            const view = new PIXI.Container();
            const g = new PIXI.Graphics();
            const color = ColorUtils.randomColor("BlueGrey");
            g.beginFill(color.shades[ROOM_SHADE_INDEX].shade);
            g.drawRect(x * this.scale, y * this.scale, width * this.scale, height * this.scale);
            g.endFill();
            view.addChild(g);

            const number = ix + 1;

            this.view.addChild(view);

            if (this.showRoomNumbers) {
                const roomNumber = new PIXI.Text(number.toString());
                roomNumber.position.set((x + width / 2) * this.scale, (y + height / 2) * this.scale);
                roomNumber.pivot.set(roomNumber.width/2, roomNumber.height/2);
                this.view.addChild(roomNumber);
            }

            const rect = new Rect(x, y, width, height);

            const result = { room, view, number, rect, color };
            return result;
        });

        this.corridors = this.map.getCorridors().map(corridor => {
            const rect = new Rect(
                Math.min(corridor._startX, corridor._endX),
                Math.min(corridor._startY, corridor._endY),
                Math.abs(corridor._endX - corridor._startX) + 1,
                Math.abs(corridor._endY - corridor._startY) + 1
            );
            const view = new PIXI.Container();
            const g = new PIXI.Graphics();
            g.beginFill(Colors.BlueGrey.C500);
            g.drawRect(rect.x1 * this.scale, rect.y1 * this.scale, rect.width * this.scale, rect.height * this.scale);
            g.endFill();
            view.addChild(g);
            this.view.addChild(view);
            return { corridor, view, rect };
        });

        this.rooms.forEach(room => {
            room.room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                d.beginFill(Colors.BlueGrey.C100);
                d.drawRect(x * this.scale, y * this.scale, 1 * this.scale, 1 * this.scale);
                d.endFill();
                room.view.addChild(d);
            });
        });

        this.placeWalls();
    }

    

    

    private placeWalls() {
        if (this.hideWalls)
            return;

       
        this.walls = new PIXI.Container();

        this.rooms.forEach(room => {

            const drawRoomWalls = (direction: Direction) => {
                this.getRoomEdge(room, direction).segments.forEach(
                    this.drawWalls(room.rect, room.color, direction));
            }

            drawRoomWalls(Direction.West);
            drawRoomWalls(Direction.East);
            drawRoomWalls(Direction.North);
            drawRoomWalls(Direction.South);
        });

        
        this.corridors.forEach(corridor => {
            const color = Colors.BlueGrey.color();
            const drawCorridorWalls = (direction: Direction) => {
                this.getCorridorEdge(corridor, direction)
                .segments
                .filter(s => {
                    return !this.isTraversable(s.from, corridor.rect.y1 - 1)
                })
                .forEach(
                    this.drawWalls(corridor.rect, color, direction));
            }
            drawCorridorWalls(Direction.North);
        });
    }

    private drawWalls(baseRect: Rect, color: Color, direction: Direction) {
        
        return (s: Segment, ix: number, all: Segment[]) => {
            let wallRect: Rect;
            switch (direction) {
                case Direction.East:
                case Direction.West: {
                    wallRect = new Rect(baseRect.x1, s.from, baseRect.width, s.to - s.from);
                    break;
                }
                case Direction.North:
                case Direction.South: {
                    wallRect = new Rect(s.from, baseRect.y1, s.to - s.from, baseRect.height);
                    break;
                }
            }

            const g = this.wallBuilder.build(wallRect, color, ix == 0 ? Tip.Extend : Tip.Contract, ix == all.length - 1 ? Tip.Extend : Tip.Contract, direction);
            this.view.addChild(g);
        };
    }

    private getDoors(roomView: RoomView) {
        const doors: Rect[] = []
        roomView.room.getDoors((x: number, y: number) => doors.push(new Rect(x, y, 1, 1)));
        return doors;
    }

    private getRoomEdge(room: RoomView, direction: Direction) {
        const rects = this.getDoors(room).concat(this.corridors.map(c => c.rect));
        return this.getSegments(room.rect, rects, direction);
    }

    private getCorridorEdge(corridor: CorridorView, direction: Direction) {
        const doors = this.rooms.map(r => this.getDoors(r));
        const rects = this.rooms.map(r => r.rect)
            .concat([].concat(...doors));
        return this.getSegments(corridor.rect, rects, direction);
    }

    private getSegments(baseRect: Rect, rects: Rect[], direction: Direction) {
        let edge: Edge, intersections: Rect[], edgeInserter: (rect: Rect) => void;

        switch(direction) {
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

    private isTraversable(x: number, y: number) {
        return !this.getPoint(x, y).value;
    }

    getPoint(x: number, y: number) {
        return this.data[x * this.height + y];
    }  
}