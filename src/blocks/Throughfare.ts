import { RoomObject } from "./RoomObject";
import { Rect } from "../core/Rect";
import { Colors } from "../core/Colors";
import * as PIXI from "pixi.js";

export class Throughfare extends RoomObject {
    constructor(x: number, y: number) {
        super(new Rect(x, y, 1, 1));
    }

    draw(scale: number) {
        const g = new PIXI.Graphics();
        g.lineStyle(2, Colors.Red.C500)
        g.beginFill(Colors.BlueGrey.C500);
        g.drawCircle(scale / 2, scale / 2, scale / 3);
        g.position.set(this.x * scale, this.y * scale);
        return g;
    }
}