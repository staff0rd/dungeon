import { Map } from "rot-js";
import { default as Dungeon } from 'rot-js/lib/map/dungeon'
import { Room, Corridor } from 'rot-js/lib/map/features'
import * as PIXI from "pixi.js";
import { Colors , ColorUtils} from './core/Colors'
import { Random } from "./core/Random";

type Point = {
    x: number;
    y: number;
    value: number;
}

type RoomView = {
    view: PIXI.Container;
    room: Room;
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

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.view = new PIXI.Container();
    }

    generate() {
        this.view.removeChildren();

        this.map = new Map.Digger(this.width, this.height, {});
        this.data = [];
        this.map.create((x: number, y: number, value: number ) => this.data.push({x, y, value}));

        this.rooms = this.map.getRooms().map(room => {
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
            this.view.addChild(view);
            return { room, view };
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
    }
}