import { Map } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import { Room, Corridor } from 'rot-js/lib/map/features'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils} from './core/Colors'

export type Point = {
    x: number;
    y: number;
    value: number;
}

type RoomView = {
    view: PIXI.Container;
    room: Room;
    number: number;
}

type CorridorView = {
    view: PIXI.Container;
    corridor: Corridor;
}

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

    constructor(width: number, height: number, showRoomNumbers: boolean) {
        this.width = width;
        this.height = height;
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
            g.beginFill(ColorUtils.random("BlueGrey").color);
            g.drawRect(x, y, width, height);
            g.endFill();
            view.addChild(g);

            room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                g.beginFill(Colors.BlueGrey.C100);
                g.drawRect(x, y, 1, 1);
                g.endFill();
                view.addChild(d);
            });

            const number = ix + 1;

            this.view.addChild(view);

            if (this.showRoomNumbers) {
                const roomNumber = new PIXI.Text(number.toString());
                roomNumber.position.set(x + width / 2, y + height / 2);
                roomNumber.pivot.set(roomNumber.width/2, roomNumber.height/2);
                this.view.addChild(roomNumber);
                roomNumber.scale.set(1/15);
            }
            const result = { room, view, number };
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
            g.drawRect(rect.x, rect.y, rect.width, rect.height);
            g.endFill();
            view.addChild(g);
            this.view.addChild(view);
            return { corridor, view };
        });

        this.view.scale.set(15);

        this.placeWalls();
    }

    private placeWalls() {
        this.walls = new PIXI.Container();
        this.data.forEach((p: Point) => {

            if (!p.value) { // traversable
                // west
                if (p.x && !this.isTraversable(p.x-1, p.y)) {
                    this.addWall(p.x-1, p.y);

                    // north west
                    if (p.y > 0 && !this.isTraversable(p.x, p.y-1)) {
                        this.addWall(p.x-1, p.y-1);
                    }
                }

                // east
                if (p.x < this.width - 1 && !this.isTraversable(p.x + 1, p.y)) {
                    this.addWall(p.x+1, p.y);

                    // north east
                    if (p.y > 0 && !this.isTraversable(p.x, p.y-1)) {
                        this.addWall(p.x+1, p.y-1);
                    }
                }

                // north
                if (p.y > 0 && !this.isTraversable(p.x, p.y-1)) {
                    this.addWall(p.x, p.y-1);
                }

                // south
                if (p.y < this.height -1 && !this.isTraversable(p.x, p.y+1)) {
                    this.addWall(p.x, p.y+1)

                    //south west
                    if (p.x && !this.isTraversable(p.x -1, p.y + 1)) {
                        this.addWall(p.x - 1, p.y + 1);
                    }

                    //south east
                    if (p.x < this.width - 1 && !this.isTraversable(p.x + 1, p.y+1)) {
                        this.addWall(p.x + 1, p.y + 1);
                    }
                }
            }

        });
        this.view.addChildAt(this.walls, 0);
    }

    private isTraversable(x: number, y: number) {
        return !this.getPoint(x, y).value;
    }

    private addWall(x: number, y: number) {
        // TODO: don't add if already added to this spot
        const g = new PIXI.Graphics();
        g.beginFill(Colors.BlueGrey.C700);
        g.drawRect(0, 0, 1, 1);
        g.endFill();
        g.position.set(x, y);
        this.walls.addChild(g);
    }

    getPoint(x: number, y: number) {
        return this.data[x * this.height + y];
    }
}