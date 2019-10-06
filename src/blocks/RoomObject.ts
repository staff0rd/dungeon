import { Rect } from "../core/Rect";
import * as PIXI from "pixi.js";

export abstract class RoomObject extends Rect {
    view: PIXI.Container;

    constructor(rect: Rect) {
        super(rect.x, rect.y, rect.width, rect.height);
        this.view = new PIXI.Container();
    }

    abstract draw(scale: number): PIXI.Container;
}