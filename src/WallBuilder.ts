import { Rect } from "./core/Rect";
import { Color, Colors } from "./core/Colors";
import { Tip } from "./Tip";
import * as PIXI from "pixi.js";
import { Direction } from "./core/Direction";
import { GradientCalculator } from "./core/GradientCalculator";

type PointsAndCenter = {
  points: number[];
  center: { x: number; y: number };
};

export class WallBuilder {
  private scale: number;
  private gradient: GradientCalculator;
  constructor(scale: number) {
    this.scale = scale;
    this.gradient = new GradientCalculator();
  }

  build(
    rect: Rect,
    color: Color,
    fromTip: Tip = Tip.Extend,
    toTip: Tip = Tip.Extend,
    direction: Direction = Direction.Right,
    focus?: boolean | undefined
  ) {
    let width: number, height: number;
    let gradient: PIXI.Texture;

    switch (direction) {
      case Direction.Left:
      case Direction.Right: {
        width = this.scale * 0.5;
        height = rect.height * this.scale;
        gradient = this.gradient.getTexture(
          direction,
          color,
          width,
          height + this.scale,
          width,
          0
        );
        break;
      }
      case Direction.Top:
      case Direction.Bottom: {
        width = rect.width * this.scale;
        height = this.scale * 0.5;
        gradient = this.gradient.getTexture(
          direction,
          color,
          width + this.scale,
          height,
          0,
          height
        );
        break;
      }
    }

    const { points, center } = this.getPointsAndCenter(
      direction,
      width,
      fromTip,
      height,
      toTip,
      rect
    );

    if (focus) {
      console.log("points", points);
      console.log("fromTip", fromTip);
      console.log("center", center);
      console.log("toTip", toTip);
      console.log("gradient", gradient);
    }

    const g = new PIXI.Graphics();
    g.position.set(center.x, center.y);
    // @ts-ignore
    g.beginTextureFill(gradient).lineStyle(1, Colors.Black).drawPolygon(points);

    return g;
  }

  private getPointsAndCenter(
    direction: Direction,
    width: number,
    fromTip: Tip,
    height: number,
    toTip: Tip,
    rect: Rect
  ): PointsAndCenter {
    switch (direction) {
      case Direction.Right: {
        return {
          points: [
            0,
            0,
            width,
            fromTip * width,
            width,
            height + -width * toTip,
            0,
            height,
          ],
          center: { x: rect.x2 * this.scale, y: rect.y1 * this.scale },
        };
      }
      case Direction.Left: {
        return {
          points: [
            0,
            fromTip * width,
            width,
            0,
            width,
            height,
            0,
            height + -width * toTip,
          ],
          center: { x: (rect.x1 - 0.5) * this.scale, y: rect.y1 * this.scale },
        };
      }
      case Direction.Top: {
        return {
          points: [
            height * fromTip,
            0,
            width + -height * toTip,
            0,
            width,
            height,
            0,
            height,
          ],
          center: { x: rect.x1 * this.scale, y: (rect.y1 - 0.5) * this.scale },
        };
      }
      case Direction.Bottom: {
        return {
          points: [
            0,
            0,
            width,
            0,
            width + -height * toTip,
            height,
            height * fromTip,
            height,
          ],
          center: { x: rect.x1 * this.scale, y: rect.y2 * this.scale },
        };
      }
    }
  }
}
