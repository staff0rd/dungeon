import { Room } from 'rot-js/lib/map/features';
import { Color, ColorUtils } from '../core/Colors';
import { Rect } from "../core/Rect";
import { RoomObject } from '../RoomGenerator';
import { PointValue } from '../core/PointValue';

const ROOM_SHADE_INDEX = 3;

export class RoomView {
    view: PIXI.Container;
    room: Room;
    number: number;
    rect: Rect;
    color: Color;
    objects: PointValue<RoomObject>[];

    constructor(room: Room, scale: number, number: number) {
        this.color = ColorUtils.randomColor("BlueGrey");
        this.room = room;
        this.draw(room, scale);
    }

    private draw(room: Room, scale: number) {
        const x = room.getLeft();
        const y = room.getTop();
        const width = room.getRight() - x + 1;
        const height = room.getBottom() - y + 1;
        const g = new PIXI.Graphics();
        g.beginFill(this.color.shades[ROOM_SHADE_INDEX].shade);
        g.drawRect(x * scale, y * scale, width * scale, height * scale);
        g.endFill();
        this.view = new PIXI.Container();
        this.view.addChild(g);
        this.rect = new Rect(x, y, width, height);
    }

    getDoors() {
        const doors: Rect[] = [];
        this.room.getDoors((x: number, y: number) => doors.push(new Rect(x, y, 1, 1)));
        return doors;
    }
};
