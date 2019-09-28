import { Map } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils, Color} from './core/Colors'
import { Point } from "./core/Point";
import { Rect } from "./core/Rect";
import { RoomView } from "./RoomView";
import { CorridorView } from "./CorridorView";
import { Tip } from "./Tip";
import { Segment } from "./Segment";
import { Direction } from "./Direction";
import { WallBuilder } from './WallBuilder';
import { EdgeManager } from "./EdgeManager";
import { isTryStatement } from "@babel/types";

const ROOM_SHADE_INDEX = 3;

export class DungeonMap {
    view: PIXI.Container;
    data: Point<number>[];
    rooms: RoomView[];
    corridors: CorridorView[];
    private map: Dungeon;
    private width: number;
    private height: number;
    private showRoomNumbers: boolean;
    private scale: number;
    private hideWalls: boolean;
    private wallBuilder: WallBuilder;
    private edges: EdgeManager;

    constructor(width: number, height: number, showRoomNumbers: boolean, scale: number, hideWalls: boolean) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.wallBuilder = new WallBuilder(this.scale);
        this.showRoomNumbers = showRoomNumbers;
        this.hideWalls = hideWalls;
        this.view = new PIXI.Container();
        this.edges = new EdgeManager();
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

        const roomEndTip = (s: Segment, ix: number, all: Segment[]) => ix == all.length - 1 ? Tip.Extend : Tip.Contract;
        const roomStartTip = (s: Segment, ix: number, _: Segment[]) => ix == 0 ? Tip.Extend : Tip.Contract;

        this.rooms.forEach(room => {
            const drawRoomWalls = (direction: Direction) => {
                this.edges.getRoomEdge(room, this.corridors, direction).segments.forEach(
                    this.drawWalls(room.rect, room.color, direction, roomStartTip, roomEndTip));
            }

            drawRoomWalls(Direction.West);
            drawRoomWalls(Direction.East);
            drawRoomWalls(Direction.North);
            drawRoomWalls(Direction.South);
        });

        
        this.corridors.forEach(corridor => {
            const corridorStartTip = (s: Segment, ix: number, _: Segment[]) => {
                if (!this.isTraversable(s.from-1, corridor.rect.y1 -1))
                    return Tip.Extend;
                else
                    return Tip.Contract;
            }
            const corridorEndTip = (s: Segment, ix: number, all: Segment[]) => {
                
                if (this.isTraversable(s.to + 1, corridor.rect.y1))
                    return Tip.Contract;
                else if (this.isTraversable(s.to + 1, corridor.rect.y1))
                    return Tip.Flat;
                else
                    return Tip.Extend;
            }
            const color = Colors.BlueGrey.color();
            const drawCorridorWalls = (direction: Direction) => {
                this.edges.getCorridorEdge(corridor, this.rooms, direction)
                .segments
                .filter(s => {
                    return !this.isTraversable(s.from, corridor.rect.y1 - 1)
                })
                .forEach(
                    this.drawWalls(corridor.rect, color, direction, corridorStartTip, corridorEndTip));
            }
            drawCorridorWalls(Direction.North);
        });
    }

    private drawWalls(baseRect: Rect, color: Color, direction: Direction, startTip: TipFunction, endTip: TipFunction) {
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

            const g = this.wallBuilder.build(wallRect, color, 
                startTip(s, ix, all), 
                endTip(s, ix, all), 
                direction);
            this.view.addChild(g);
        };
    }

    private isTraversable(x: number, y: number) {
        return !this.getPoint(x, y).value;
    }

    getPoint(x: number, y: number) {
        return this.data[x * this.height + y];
    }  
}

type TipFunction = (s: Segment, index: number, all: Segment[]) => Tip;

 
