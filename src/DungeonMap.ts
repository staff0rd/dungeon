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

    constructor(width: number, height: number, showRoomNumbers: boolean, scale: number) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.showRoomNumbers = showRoomNumbers;
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
            return { corridor, view };
        });


        this.placeWalls();
    }

    private westWall(x: number, y: number, width: number, height: number, color: Color) {

        const from = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const to = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade)

        let g = new PIXI.Graphics()
            .beginTextureFill(this.gradient(from, to, width, height, width, 0))
            .lineStyle(1, Colors.Black)
            .drawPolygon([
                0, 0,
                this.scale * .5, this.scale * .5,
                this.scale * .5, height - this.scale * .5,
                0, height
            ]);
        g.position.set((x- .5) * this.scale, (y - .5) * this.scale)
        return g;
    }

    private placeWalls() {
        this.walls = new PIXI.Container();
        this.rooms.forEach(room => {

            const dark = ColorUtils.toHtml(room.color.shades[ROOM_WALL_FROM_INDEX].shade);
            const light = ColorUtils.toHtml(room.color.shades[ROOM_WALL_TO_INDEX].shade);

            let thin = this.scale * .5;
            let wide = (room.rect.height + 1) * this.scale;

            // left
            let g = this.westWall(room.rect.x, room.rect.y, thin, wide, room.color)
            
            this.view.addChild(g);

            // right
            g = new PIXI.Graphics()
                .beginTextureFill(this.gradient( dark, light, thin, wide + this.scale, thin, 0))
                .lineStyle(1, Colors.Black)
                .drawPolygon([
                    0, this.scale,
                    this.scale * .5, this.scale * .5,
                    this.scale * .5, wide + this.scale * .5,
                    0, wide
                ]);
            g.position.set((room.rect.x + room.rect.width) * this.scale, (room.rect.y - 1) * this.scale)
            
            this.view.addChild(g);
            
            wide = (room.rect.width + 1 ) * this.scale

            // top
            g = new PIXI.Graphics()
                .beginTextureFill(this.gradient(light, dark, wide, thin, 0, thin))
                .lineStyle(1, Colors.Black)
                .drawPolygon([
                    0, 0,
                    wide, 0,
                    wide - this.scale * .5, this.scale * .5,
                    this.scale * .5, this.scale * .5
                ]);
            g.position.set((room.rect.x- .5) * this.scale, (room.rect.y - .5) * this.scale)
            
            this.view.addChild(g);

            // bottom
            g = new PIXI.Graphics()
                .beginTextureFill(this.gradient(light, dark, wide, thin, 0, thin))
                .lineStyle(1, Colors.Black)
                .drawPolygon([
                    this.scale * .5, 0,
                    wide - this.scale * .5, 0,
                    wide, this.scale * .5,
                    0, this.scale * .5
                ]);
            g.position.set((room.rect.x -.5 )* this.scale, (room.rect.y + room.rect.height) * this.scale)
            
            this.view.addChild(g);


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