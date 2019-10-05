import * as PIXI from "pixi.js";
import { Point } from './core/Point';
import { Colors } from "./core/Colors";
import { Plane } from "./core/Plane";
import { Rect } from "./core/Rect";
import { Random } from "./core/Random";

export class DoorView {
    view: PIXI.Container;
    position: Point;
    private background: PIXI.Graphics;
    private foreground: PIXI.Container;
    private scale: number;
    private plane: Plane;
    private _number : number;
    public get number() : number { return this._number; }
    private _rect : Rect;
    public get rect() : Rect { return this._rect; }
    

    constructor(x: number, y: number, plane: Plane, scale: number, number: number) {
        this.view = new PIXI.Container();
        this._rect = new Rect(x, y, 1, 1);
        this.position = { x, y };
        this.scale = scale;
        this._number = number;
        this.plane = plane;
    }

    draw() {
        this.drawBackground();
        this.drawForeground();
        this.drawPattern();
    }

    drawPattern() {
        const container = new PIXI.Container();
        for (let i = this.scale; i > 0; i-= this.scale/5) {
            const shades = Colors.Brown.color().shades;
            const start = 3;
            const color = Random.pick([shades[start], shades[start+1], shades[start+2]]).shade
            const g = new PIXI.Graphics();
            g.beginFill(color)
            .lineStyle(1, Colors.Black)
            .drawRect(0, 0, i, this.scale)
            g.endFill();
            container.addChild(g);
        }
        container.pivot.set(container.width/2, container.height/2);
        container.position.set(this.scale * (this.position.x + .5), this.scale * (this.position.y + .5));
        this.foreground.addChild(container);
    }

    drawNumber() {
        const g = new PIXI.Text(this.number.toString(), {fontSize: 12, foreground: Colors.Black });
        this.view.addChild(g);
        g.pivot.set(g.width/2, g.height/2);
        g.position.set((this.position.x + .5) * this.scale, (this.position.y + .5) * this.scale);
    }

    drawForeground() {
        const g = new PIXI.Graphics();
        g.beginFill(Colors.Orange.C500)
        //.lineStyle(1, Colors.Black)
        .drawRect(this.position.x * this.scale, this.position.y * this.scale, this.scale, this.scale)
        .endFill();
        this.foreground = new PIXI.Container();
        this.foreground.addChild(g);
        this.view.addChild(this.foreground);
    }

    private drawBackground() {
        const g = new PIXI.Graphics();
        g.beginFill(Colors.BlueGrey.C100);
        g.drawRect(this.position.x * this.scale, this.position.y * this.scale, 1 * this.scale, 1 * this.scale);
        g.endFill();
        this.background = g;
        this.view.addChild(g);
    }
}
