import { Rect } from './core/Rect';
import { Color, Colors } from './core/Colors';
import { Tip } from './Tip'
import * as PIXI from "pixi.js";
import { Direction } from './Direction';
import { GradientCalculator } from './GradientCalculator';

export class WallBuilder {
    private scale: number;
    private gradient: GradientCalculator;
    constructor(scale: number) {
        this.scale = scale;
        this.gradient = new GradientCalculator();
    }

    build(rect: Rect, color: Color, fromTip: Tip = Tip.Extend, toTip: Tip = Tip.Extend, direction: Direction = Direction.East) {
        let width: number, height: number;
        let gradient: PIXI.Texture;
        const g = new PIXI.Graphics();
        const points: number[] = [];

        switch (direction) {
            case Direction.West:
            case Direction.East: {
                width = this.scale * .5;
                height = rect.height * this.scale;
                gradient = this.gradient.getTexture(direction, color, width, height + this.scale, width, 0);
                break;
            }
            case Direction.North:
            case Direction.South: {
                width = rect.width * this.scale;
                height = this.scale * .5;
                gradient = this.gradient.getTexture(direction, color, width + this.scale, height, 0, height);
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
            case Direction.North: {
                points.push(
                    (height * fromTip), 0, 
                    width + (-height * toTip), 0, 
                    width, height, 
                    0, height
                );
                g.position.set(rect.x1 * this.scale, (rect.y1 -.5) * this.scale);
                break;
            }
            case Direction.South: {
                points.push(
                    0, 0,
                    width, 0,
                    width + (-height * toTip), height,
                    (height * fromTip), height
                );
                g.position.set(rect.x1 * this.scale, rect.y2 * this.scale);
                break;
            }
        }

        g.beginTextureFill(gradient)
            .lineStyle(1, Colors.Black)
            .drawPolygon(points);
        
        return g;
    }
}