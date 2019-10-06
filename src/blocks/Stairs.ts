import * as PIXI from "pixi.js";
import { Colors } from "../core/Colors";
import { Random } from "../core/Random";
import { Rect } from "../core/Rect";
import { RoomObject } from "./RoomObject";
import { StairDirection } from "./StairDirection";

export class Stairs extends RoomObject {
    direction: StairDirection;
    constructor(rect: Rect, direction: StairDirection) {
        super(rect);
        this.direction = direction;
    }

    draw(scale: number) {
        const steps = 10;
        const direction = Random.pick([(i: number) => 1 - i / steps, (i: number) => i / steps]);
        const zeroStepper = (i: number) => 0;
        
        if (this.width > this.height) {
            const stepWidth = this.width / steps;
            this.drawStairs(steps, direction, scale, (i: number) => stepWidth * i * scale, zeroStepper, stepWidth * scale, this.height * scale);
        } else {
            const stepWidth = this.height / steps;
            this.drawStairs(steps, direction, scale, zeroStepper, (i: number) => stepWidth * i * scale, this.width * scale, stepWidth * scale);
        }

        return this.view;
    }

    private drawStairs(steps: number, directionFunction: (i: number) => number, scale: number, xStepper: (i: number) => number, yStepper: (i: number) => number, width: number, height: number) {
        let g = this.drawBorder(scale);
        this.view.addChild(g);
        for (let i = 0; i < steps; i++) {
            g = new PIXI.Graphics();
            g.beginFill(Colors.Black, directionFunction(i));
            g.drawRect(this.x * scale + xStepper(i), this.y * scale + yStepper(i), width, height);
            this.view.addChild(g);
        }
        return g;
    }

    private drawBorder(scale: number) {
        let g = new PIXI.Graphics();
        g.lineStyle(1, Colors.Black)
            .beginFill(0, 0)
            .drawRect(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
        return g;
    }
}