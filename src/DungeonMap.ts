import { Map } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import { Room, Corridor } from 'rot-js/lib/map/features'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils, Color} from './core/Colors'

export type Point = {
    x: number;
    y: number;
    value: number;
}

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

type RoomView = {
    view: PIXI.Container;
    room: Room;
    number: number;
    rect: Rect;
    color: Color;
}

type CorridorView = {
    view: PIXI.Container;
    corridor: Corridor;
    rect: Rect;
}
const ROOM_SHADE_INDEX = 3;
const ROOM_WALL_FROM_INDEX = 4;
const ROOM_WALL_TO_INDEX = 9;

export class DungeonMap {
    view: PIXI.Container;
    data: Point[];
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
            console.log(x,y)
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

            room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                g.beginFill(Colors.BlueGrey.C100);
                g.drawRect(x * this.scale, y * this.scale, 1 * this.scale, 1 * this.scale);
                g.endFill();
                view.addChild(d);
            });

            const number = ix + 1;

            this.view.addChild(view);

            if (this.showRoomNumbers) {
                const roomNumber = new PIXI.Text(number.toString());
                roomNumber.position.set((x + width / 2) * this.scale, (y + height / 2) * this.scale);
                roomNumber.pivot.set(roomNumber.width/2, roomNumber.height/2);
                this.view.addChild(roomNumber);
            }

            const rect = { x, y, width, height};

            const result = { room, view, number, rect, color };
            console.log(number, result);
            return result;
        });

        this.corridors = this.map.getCorridors().map(corridor => {
            const rect = {
                x: Math.min(corridor._startX, corridor._endX),
                y: Math.min(corridor._startY, corridor._endY),
                width: Math.abs(corridor._endX - corridor._startX) + 1,
                height: Math.abs(corridor._endY - corridor._startY) + 1
            };
            const view = new PIXI.Container();
            const g = new PIXI.Graphics();
            g.beginFill(Colors.BlueGrey.C500);
            g.drawRect(rect.x * this.scale, rect.y * this.scale, rect.width * this.scale, rect.height * this.scale);
            g.endFill();
            view.addChild(g);
            this.view.addChild(view);
            return { corridor, view, rect };
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
        g.position.set((rect.x- .5) * this.scale, (rect.y - .5) * this.scale)
        return g;
    }

    private eastWall(rect: Rect, color: Color) {
        let width = this.scale * .5;
        let height = (rect.height + 1) * this.scale;

        const to = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const from = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);

        let g = new PIXI.Graphics()
        .beginTextureFill(this.gradient( from, to, width, height + this.scale, width, 0))
        .lineStyle(1, Colors.Black)
        .drawPolygon([
            0, this.scale,
            this.scale * .5, this.scale * .5,
            this.scale * .5, height + this.scale * .5,
            0, height
        ]);
    g.position.set((rect.x + rect.width) * this.scale, (rect.y - 1) * this.scale)
        return g;
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
        g.position.set((rect.x - .5) * this.scale, (rect.y - .5) * this.scale)
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
        g.position.set((rect.x -.5 )* this.scale, (rect.y + rect.height) * this.scale)
        return g;
    }

    private placeWalls() {
        if (this.hideWalls)
            return;

        this.walls = new PIXI.Container();

        this.rooms.forEach(room => {
            let g = this.westWall(room.rect, room.color)            
            this.view.addChild(g);

            g = this.eastWall(room.rect, room.color);            
            this.view.addChild(g);
            
            g = this.northWall(room.rect, room.color);
            this.view.addChild(g);

            g = this.southWall(room.rect, room.color);
            this.view.addChild(g);
        });

        this.corridors.forEach(corridor => {
            const color = Colors.BlueGrey.color();
            if (!this.isTraversable(corridor.rect.x - 1, corridor.rect.y))
                this.view.addChild(this.westWall(corridor.rect, color))

            if (!this.isTraversable(corridor.rect.x + 1, corridor.rect.y))
                this.view.addChild(this.eastWall(corridor.rect, color))
            
            if (!this.isTraversable(corridor.rect.x, corridor.rect.y - 1))
                this.view.addChild(this.northWall(corridor.rect, color));

            if (!this.isTraversable(corridor.rect.x, corridor.rect.y + 1))  
                this.view.addChild(this.southWall(corridor.rect, color))
            
            
        });
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