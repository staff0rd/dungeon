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

const ROOM_SHADE_INDEX = 3;
const ROOM_WALL_FROM_INDEX = 4;
const ROOM_WALL_TO_INDEX = 9;

enum Direction {
    North,
    East,
    South,
    West
}

type GradientColorPoint = {
    start: string;
    stop: string;
}

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

    constructor(width: number, height: number, showRoomNumbers: boolean, scale: number, hideWalls: boolean) {
        this.width = width;
        this.height = height;
        this.scale = scale;
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

    private drawWall(rect: Rect, color: Color, fromTip: Tip = Tip.Extend, toTip: Tip = Tip.Extend, direction: Direction = Direction.East) {
        let width: number, height: number;
        let gradient: PIXI.Texture;
        const g = new PIXI.Graphics();
        const points: number[] = [];
        const gradientColors = this.getGradientStops(direction, color);

        switch (direction) {
            case Direction.West:
            case Direction.East: {
                width = this.scale * .5;
                height = rect.height * this.scale;
                gradient = this.gradient(gradientColors.start, gradientColors.stop, width, height + this.scale, width, 0);
                break;
            }
            case Direction.North:
            case Direction.South: {
                width = rect.width * this.scale;
                height = this.scale * .5;
                gradient = this.gradient(gradientColors.start, gradientColors.stop, width + this.scale, height, 0, height);
                break;
            }
        }

        switch (direction) {
            case Direction.East: {
                points.push(
                    0, 0, 
                    width, fromTip * width,
                    width, height + (-width * toTip),
                    0, height
                );
                g.position.set(rect.x2 * this.scale, rect.y1 * this.scale);
                break;
            }
            case Direction.West: {
                points.push(
                    0, fromTip * width,
                    width, 0,
                    width, height,
                    0, height + (-width * toTip)
                );
                g.position.set((rect.x1 - .5) * this.scale, rect.y1 * this.scale);
                break;
            }
            case Direction.North: {
                points.push(
                    (height * fromTip), 0, 
                    width + (-height * toTip), 0, 
                    width, height, 
                    0, height
                );
                g.position.set(rect.x1 * this.scale, (rect.y1 -.5) * this.scale);
                break;
            }
            case Direction.South: {
                points.push(
                    0, 0,
                    width, 0,
                    width + (-height * toTip), height,
                    (height * fromTip), height
                );
                g.position.set(rect.x1 * this.scale, rect.y2 * this.scale);
                break;
            }
        }

        g.beginTextureFill(gradient)
            .lineStyle(1, Colors.Black)
            .drawPolygon(points);
        
        return g;
    }

    private getGradientStops(direction: Direction, color: Color): GradientColorPoint {
        const shade1 = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const shade2 = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);
        if (direction == Direction.East || direction == Direction.South) {
            return { start: shade1, stop: shade2 };
        } else {
            return { start: shade2, stop: shade1 };
        }
    }

    private placeWalls() {
        if (this.hideWalls)
            return;

            let g: PIXI.Graphics;
        this.walls = new PIXI.Container();

        this.rooms.forEach(room => {

            const drawRoomWalls = (direction: Direction) => {
                this.getRoomSegments(room, direction).segments.forEach((s, ix, all) => {
                    let rect: Rect;
                    const color = room.color;
                    switch (direction) {
                        case Direction.East:
                        case Direction.West: {
                            rect = new Rect(room.rect.x1, s.from, room.rect.width, s.to - s.from);
                            break;
                        }
                        case Direction.North:
                        case Direction.South: {
                            rect = new Rect(s.from, room.rect.y1, s.to - s.from, room.rect.height);
                            break;
                        }

                    }
                    g = this.drawWall(rect, color, 
                        ix == 0 ? Tip.Extend: Tip.Contract, 
                        ix == all.length-1 ? Tip.Extend : Tip.Contract,
                        direction);
                    this.view.addChild(g);
                });
            }

            drawRoomWalls(Direction.West);
            drawRoomWalls(Direction.East);
            drawRoomWalls(Direction.North);
            drawRoomWalls(Direction.South);
        });

        
        this.corridors.forEach(corridor => {
            const color = Colors.BlueGrey.color();
            // if (!this.isTraversable(corridor.rect.x1 - 1, corridor.rect.y2))
            //     this.view.addChild(this.westWall(corridor.rect, color))

        });
        // this.corridors.forEach(corridor => {
        //     if (!this.isTraversable(corridor.rect.x1 - 1, corridor.rect.y2))
        //         this.view.addChild(this.westWall(corridor.rect, color))

        //     if (!this.isTraversable(corridor.rect.x1 + 1, corridor.rect.y2))
        //         this.view.addChild(this.drawWall(corridor.rect, color, Tip.Extend))
            
        //     if (!this.isTraversable(corridor.rect.x1, corridor.rect.y2 - 1))
        //         this.view.addChild(this.northWall(corridor.rect, color));

        //     if (!this.isTraversable(corridor.rect.x1, corridor.rect.y2 + 1))  
        //         this.view.addChild(this.southWall(corridor.rect, color))
            
            
        // });
    }

    private getDoors(roomView: RoomView) {
        const doors: Rect[] = []
        roomView.room.getDoors((x: number, y: number) => doors.push(new Rect(x, y, 1, 1)));
        return doors;
    }

    private getRoomSegments(room: RoomView, direction: Direction) {
        const rects = this.getDoors(room).concat(this.corridors.map(c => c.rect));
        return this.getSegments(room.rect, rects, direction);
    }

    private getCorridorSegments(corridor: CorridorView, direction: Direction) {
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

    gradient(from: string, to: string, width: number, height: number, gradientWidth: number, gradientHeight: number) {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        const grd = ctx.createLinearGradient(0, 0, gradientWidth, gradientHeight);
        grd.addColorStop(0, from);
        grd.addColorStop(1, to);
        ctx.fillStyle = grd;
        ctx.fillRect(0,0, width, height);
        return PIXI.Texture.from(c);
      }
}