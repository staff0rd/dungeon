import { Map, RNG } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils, Color} from './core/Colors'
import { Point } from "./core/Point";
import { Rect } from "./core/Rect";
import { RoomView } from "./RoomView";
import { CorridorView } from "./CorridorView";
import { Tip } from "./Tip";
import { Segment } from "./Segment";
import { Direction } from "./core/Direction";
import { WallBuilder } from './WallBuilder';
import { EdgeManager } from "./EdgeManager";
import { Config } from "./Config";
import { Edge } from "./Edge";
import { corridorEndTip, corridorStartTip } from "./corridorTip";

const ROOM_SHADE_INDEX = 3;

export class DungeonMap {
    view: PIXI.Container;
    data: Point<number>[];
    rooms: RoomView[];
    corridors: CorridorView[];
    private map: Dungeon;
    private width: number;
    private height: number;
    private scale: number;
    private wallBuilder: WallBuilder;
    private edgeManager: EdgeManager;
    private config: Config;

    constructor(config: Config) {
        this.width = config.width;
        this.height = config.height;
        this.scale = config.scale;
        this.wallBuilder = new WallBuilder(this.scale);
        this.view = new PIXI.Container();
        this.edgeManager = new EdgeManager((x, y) => this.isTraversable(x, y));
        this.config = config;
    }

    setSeed(seed: number) {
        RNG.setSeed(seed);
    }

    generate(seed: number) {
        this.setSeed(seed);
        
        this.view.removeChildren();
        
        this.createMap();

        this.buildRooms();

        this.buildCorridors();

        this.drawDoors();

        if (!this.config.hideWalls) {
            this.placeRoomWalls();
            
            this.placeCorridorWalls();
        }

        this.drawPassable();

        this.highlightCorridor();
    }

    private highlightCorridor() {
        if (this.config.corridor) {
            const rect = this.corridors[this.config.corridor - 1].rect;
            const g = new PIXI.Graphics();
            g.lineStyle(2, Colors.Black);
            g.drawRect(rect.x * this.scale, rect.y * this.scale, rect.width * this.scale, rect.height * this.scale);
            this.view.addChild(g);
        }
    }

    private drawDoors() {
        this.rooms.forEach(room => {
            room.room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                d.beginFill(Colors.BlueGrey.C100);
                d.drawRect(x * this.scale, y * this.scale, 1 * this.scale, 1 * this.scale);
                d.endFill();
                room.view.addChild(d);
            });
        });
    }

    buildCorridors() {
        this.corridors = this.map.getCorridors().map((corridor, ix) => {
            const number = ix + 1;
            const rect = new Rect(Math.min(corridor._startX, corridor._endX), Math.min(corridor._startY, corridor._endY), Math.abs(corridor._endX - corridor._startX) + 1, Math.abs(corridor._endY - corridor._startY) + 1);
            const view = new PIXI.Container();
            const g = new PIXI.Graphics();
            g.beginFill(Colors.BlueGrey.C500);
            g.drawRect(rect.x1 * this.scale, rect.y1 * this.scale, rect.width * this.scale, rect.height * this.scale);
            g.endFill();
            view.addChild(g);
            this.view.addChild(view);
            if (this.config.corridorNumbers) {
                this.addNumber(rect, number, 12);
            }
            return { corridor, view, rect, number };
        });
    }

    private buildRooms() {
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
            const rect = new Rect(x, y, width, height);
            if (this.config.roomNumbers) {
                this.addNumber(rect, number);
            }
            const result = { room, view, number, rect, color };
            return result;
        });
    }

    createMap() {
        this.map = new Map.Digger(this.width, this.height, {});
        this.data = [];
        this.map.create((x: number, y: number, value: number) => {
            this.data.push({ x, y, value });
        });
    }

    private drawPassable() {
        if (this.config.passable) {
            const fontSize = 10;
            const color = Colors.White;
            const alpha = .25;
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (x == 0 || x == this.width - 1) {
                        this.addNumber(new Rect(x, y, 1, 1), y, fontSize, color, alpha);
                    } else if (y == 0 || y == this.height - 1) {
                        this.addNumber(new Rect(x, y, 1, 1), x, fontSize, color, alpha);
                    } else {
                        const value = this.getPoint(x, y).value;
                        this.addNumber(new Rect(x, y, 1, 1), value, fontSize, color, alpha);
                    }
                }
            }
        }
    }

    private addNumber(rect: Rect, number: number, fontSize = 20, color: number = Colors.Black, alpha = 1) {
        const text = new PIXI.Text(number.toString(), { fontSize: fontSize, fill: color });
        text.alpha = alpha;
        text.position.set((rect.x + rect.width / 2) * this.scale, (rect.y + rect.height / 2) * this.scale);
        text.pivot.set(text.width / 2, text.height / 2);
        this.view.addChild(text);
    }

    private placeCorridorWalls() {
        const drawCorridorWalls = (direction: Direction) => {
            const color = Colors.BlueGrey.color();
            const edges = this.edgeManager.getCorridorEdges(this.corridors, direction, this.rooms);
            edges.forEach(edge => {
                edge.segments.forEach(this.drawWalls(edge, color, direction, corridorStartTip, corridorEndTip));
            });
        };
        drawCorridorWalls(Direction.Top);
        drawCorridorWalls(Direction.Bottom);
        drawCorridorWalls(Direction.Left);
        drawCorridorWalls(Direction.Right);
    }

    private placeRoomWalls() {
        const roomEndTip = (s: Segment, ix: number, edge: Edge) => ix == edge.segments.length - 1 ? Tip.Extend : Tip.Contract;
        const roomStartTip = (s: Segment, ix: number, _: Edge) => ix == 0 ? Tip.Extend : Tip.Contract;
        this.rooms.forEach(room => {
            const drawRoomWalls = (direction: Direction) => {
                const edge = this.edgeManager.getRoomEdge(room, this.corridors, direction);
                edge.segments.forEach(this.drawWalls(edge, room.color, direction, roomStartTip, roomEndTip));
            };
            drawRoomWalls(Direction.Left);
            drawRoomWalls(Direction.Right);
            drawRoomWalls(Direction.Top);
            drawRoomWalls(Direction.Bottom);
        });
    }

    private drawWalls(edge: Edge, color: Color, direction: Direction, startTip: TipFunction, endTip: TipFunction) {
        return (s: Segment, ix: number, all: Segment[]) => {
            let wallRect: Rect;
            switch (direction) {
                case Direction.Right:
                case Direction.Left: {
                    wallRect = new Rect(edge.rect.x1, s.from, edge.rect.width, s.to - s.from);
                    break;
                }
                case Direction.Top:
                case Direction.Bottom: {
                    wallRect = new Rect(s.from, edge.rect.y1, s.to - s.from, edge.rect.height);
                    break;
                }
            }

            const g = this.wallBuilder.build(wallRect, color, 
                startTip(s, ix, edge, direction, (x, y) => this.isTraversable(x,y)), 
                endTip(s, ix, edge, direction, (x, y) => this.isTraversable(x,y)), 
                direction);
            this.view.addChild(g);
        };
    }

    isTraversable(x: number, y: number) {
        const point = this.getPoint(x, y); 
        return !point.value;
    }

    getPoint(x: number, y: number) {
        return this.data[x * this.height + y];
    }  
}

type TipFunction = (s: Segment, index: number, edge: Edge, direction: Direction, isTraversable: (x: number, y: number) => boolean) => Tip;

 
