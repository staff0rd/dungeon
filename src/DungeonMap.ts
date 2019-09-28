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

    private westWall(rect: Rect, color: Color) {
        let width = this.scale * .5;
        let height = (rect.height + 1) * this.scale;

        const from = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const to = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);

        let g = new PIXI.Graphics()
            .beginTextureFill(this.gradient(from, to, width, height, width, 0))
            .lineStyle(1, Colors.Black)
            .drawPolygon([
                0, 0,
                this.scale * .5, this.scale * .5,
                this.scale * .5, height - this.scale * .5,
                0, height
            ]);
        g.position.set((rect.x1 -.5) * this.scale, (rect.y1 - .5) * this.scale)
        return g;
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

    private northWall(rect: Rect, color: Color) {
        let width = (rect.width + 1) * this.scale
        let height = this.scale * .5;

        const from = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const to = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);

        const g = new PIXI.Graphics()
            .beginTextureFill(this.gradient(from, to, width, height, 0, height))
            .lineStyle(1, Colors.Black)
            .drawPolygon([
                0, 0,
                width, 0,
                width - this.scale * .5, this.scale * .5,
                this.scale * .5, this.scale * .5
            ]);
        g.position.set((rect.x1 - .5) * this.scale, (rect.y1 - .5) * this.scale)
        return g;
    }

    private southWall(rect: Rect, color: Color) {
        let width = (rect.width + 1) * this.scale
        let height = this.scale * .5;

        const to = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const from = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);

        const g = new PIXI.Graphics()
        .beginTextureFill(this.gradient(from, to, width, height, 0, height))
        .lineStyle(1, Colors.Black)
        .drawPolygon([
            this.scale * .5, 0,
            width - this.scale * .5, 0,
            width, this.scale * .5,
            0, this.scale * .5
        ]);
        g.position.set((rect.x1 -.5 )* this.scale, rect.y2 * this.scale)
        return g;
    }

    private placeWalls() {
        if (this.hideWalls)
            return;

            let g: PIXI.Graphics;
        this.walls = new PIXI.Container();

        this.rooms.forEach(room => {

            const h = (direction: Direction) => {
                this.getSegments(room, direction).segments.forEach((s, ix, all) => {
                    let rect = new Rect(room.rect.x1, s.from, room.rect.width, s.to - s.from);
                    g = this.drawWall(rect, room.color, 
                        ix == 0 ? Tip.Extend: Tip.Contract, 
                        ix == all.length-1 ? Tip.Extend : Tip.Contract,
                        direction);
                    this.view.addChild(g);
                });
            }

            h(Direction.West);
            h(Direction.East);
            
            g = this.northWall(room.rect, room.color);
            this.view.addChild(g);

            g = this.southWall(room.rect, room.color);
            this.view.addChild(g);
        });

        return;

        this.corridors.forEach(corridor => {
            const color = Colors.BlueGrey.color();
            if (!this.isTraversable(corridor.rect.x1 - 1, corridor.rect.y2))
                this.view.addChild(this.westWall(corridor.rect, color))

            if (!this.isTraversable(corridor.rect.x1 + 1, corridor.rect.y2))
                this.view.addChild(this.drawWall(corridor.rect, color, Tip.Extend))
            
            if (!this.isTraversable(corridor.rect.x1, corridor.rect.y2 - 1))
                this.view.addChild(this.northWall(corridor.rect, color));

            if (!this.isTraversable(corridor.rect.x1, corridor.rect.y2 + 1))  
                this.view.addChild(this.southWall(corridor.rect, color))
            
            
        });
    }

    private getDoors(roomView: RoomView) {
        const doors: Rect[] = []
        roomView.room.getDoors((x: number, y: number) => doors.push(new Rect(x, y, 1, 1)));
        return doors;
    }

    private getSegments(room: RoomView, direction: Direction) {
        const rects = this.getDoors(room).concat(this.corridors.map(c => c.rect));
        let edge: Edge, intersections: Rect[], edgeInserter: (rect: Rect) => void;

        // if (room.number != 5 || <any>direction != Direction.West)
        //      return new Edge(room.rect.y1, room.rect.y2, Structure.Room);

        switch(direction) {
            case Direction.East:
            case Direction.West: {
                edge = new Edge(room.rect.y1, room.rect.y2, Structure.Room);
                edgeInserter = (rect: Rect) => edge.insert(rect.y1, rect.y2, Structure.Corridor);
                intersections = rects.filter(rect => rect.height == 1 && between(rect.y1, room.rect.y1, room.rect.y2));
                break;
            }
        }

        switch (direction) {
            case Direction.East: {
                intersections = intersections.filter(rect => rect.x1 == room.rect.x2);
                break;
            }
            case Direction.West: {
                intersections = intersections.filter(rect => rect.x2 == room.rect.x1);
                break;
            }
        }

        intersections.forEach(edgeInserter);
        console.log(edge.segments, room.rect)

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