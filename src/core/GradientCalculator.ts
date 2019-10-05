import { Color, ColorUtils } from './Colors';
import { Direction } from './Direction';
import { GradientColorPoint } from './GradientColorPoint';
import * as PIXI from "pixi.js";

const ROOM_WALL_FROM_INDEX = 4;
const ROOM_WALL_TO_INDEX = 9;

export class GradientCalculator {
    private getStops(direction: Direction, color: Color): GradientColorPoint {
        const shade1 = ColorUtils.toHtml(color.shades[ROOM_WALL_TO_INDEX].shade);
        const shade2 = ColorUtils.toHtml(color.shades[ROOM_WALL_FROM_INDEX].shade);
        if (direction == Direction.Right || direction == Direction.Bottom) {
            return { start: shade1, stop: shade2 };
        }
        else {
            return { start: shade2, stop: shade1 };
        }
    }
    getTexture(direction: Direction, color: Color, width: number, height: number, gradientWidth: number, gradientHeight: number) {
        const stops = this.getStops(direction, color);
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        const grd = ctx.createLinearGradient(0, 0, gradientWidth, gradientHeight);
        grd.addColorStop(0, stops.start);
        grd.addColorStop(1, stops.stop);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        return PIXI.Texture.from(c);
    }
}
