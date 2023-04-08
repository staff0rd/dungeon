import { Direction } from "./Direction";

export class Rect {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  public get x1(): number {
    return this._x;
  }
  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public get y1(): number {
    return this._y;
  }
  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }
  public get x2() {
    return this._x + this._width;
  }
  public get y2() {
    return this._y + this._height;
  }
  public get left() {
    return this.x1;
  }
  public get right() {
    return this.x2;
  }
  public get top() {
    return this.y1;
  }
  public get bottom() {
    return this.y2;
  }
  public get area() {
    return this.width * this.height;
  }

  constructor(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  equals(rect: Rect) {
    return (
      this.x1 == rect.x1 &&
      this.x2 == rect.x2 &&
      this.y1 == rect.y1 &&
      this.y2 == rect.y2
    );
  }

  aligned(rect: Rect, direction: Direction) {
    switch (direction) {
      case Direction.Top:
        return rect.top == this.top;
      case Direction.Right:
        return rect.right == this.right;
      case Direction.Bottom:
        return rect.bottom == this.bottom;
      case Direction.Left:
        return rect.left == this.left;
    }
  }

  adjacent(rect: Rect, direction: Direction) {
    switch (direction) {
      case Direction.Top:
      case Direction.Bottom: {
      }
      case Direction.Left:
      case Direction.Right: {
      }
    }
  }

  from(direction: Direction) {
    switch (direction) {
      case Direction.Top:
      case Direction.Bottom:
        return this.left;
      case Direction.Left:
      case Direction.Right:
        return this.top;
    }
  }

  to(direction: Direction) {
    switch (direction) {
      case Direction.Top:
      case Direction.Bottom:
        return this.right;
      case Direction.Left:
      case Direction.Right:
        return this.bottom;
    }
  }

  intersects(rect: Rect) {
    return (
      this.right > rect.left &&
      this.left < rect.right &&
      this.bottom > rect.top &&
      this.top < rect.bottom
    );
  }
}
