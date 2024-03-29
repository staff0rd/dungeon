import { Direction } from "../../core/Direction";
import { Rect } from "../../core/Rect";
import { Segment } from "./Segment";
import { SegmentPoint } from "./SegmentPoint";
import { Structure } from "./Structure";

export class Edge {
  endMatchesStart(e: Edge) {
    return e.start == this.end && this.endSegment.type == e.startSegment.type;
  }
  startMatchesEnd(e: Edge) {
    return this.start == e.end && this.startSegment.type == e.endSegment.type;
  }
  get endSegment() {
    return this._segments[this._segments.length - 1];
  }
  get startSegment() {
    return this._segments[0];
  }
  get segmentPoints() {
    return this._segments;
  }

  toString() {
    return (
      "[" +
      this.segmentPoints.map((sp) => `(${sp.point}, ${sp.type})`).join(", ") +
      "]"
    );
  }

  join(second: Edge): any {
    this._segments.pop();
    second.segmentPoints.shift();
    this._segments = this._segments.concat(second.segmentPoints);
  }

  private _segments: SegmentPoint[];
  private _type: Structure;
  private _rect: Rect;
  private _direction: Direction;

  get type() {
    return this._type;
  }

  get rect() {
    return this._rect;
  }

  get direction() {
    return this._direction;
  }

  get start() {
    if (this.segments.length) return this.segments[0].from;
  }
  get end() {
    if (this.segments.length) return this.segments[this.segments.length - 1].to;
  }

  constructor(rect: Rect, direction: Direction, type: Structure) {
    this._segments = [
      new SegmentPoint(rect.from(direction), type),
      new SegmentPoint(rect.to(direction), type),
    ];
    this._type = type;
    this._direction = direction;
    this._rect = rect;
  }

  get segments() {
    const segments: Segment[] = [];
    for (let i = 1; i < this._segments.length; i++) {
      if (this._segments[i - 1].type == this._type) {
        segments.push(
          new Segment(this._segments[i - 1].point, this._segments[i].point)
        );
      }
    }
    return segments;
  }

  insert(p1: number, p2: number, type: Structure) {
    if (!this._segments.length) return;

    if (p1 <= this.start! && p2 >= this.end!) {
      this._segments = [];
      return;
    }
    if (p1 <= this.start!) {
      while (this.start! <= p2) {
        this._segments.shift();
      }
      this._segments.unshift(
        new SegmentPoint(p1, Structure.Gap),
        new SegmentPoint(p2, this._type)
      );
    } else if (p2 >= this.end!) {
      while (this.end! >= p1) {
        this._segments.pop();
      }
      this._segments.push(new SegmentPoint(p1, Structure.Gap));
      this._segments.push(new SegmentPoint(p2, this._type));
    } else {
      for (let i = 0; i < this._segments.length; i++) {
        if (!this._segments[i + 1] || this._segments[i + 1].point > p1) {
          const from = p1;
          const to = p2;
          this._segments.splice(
            i + 1,
            0,
            new SegmentPoint(from, type),
            new SegmentPoint(to, this._segments[i].type)
          );
          if (
            this._segments[this._segments.length - 1].point ==
            this._segments[this._segments.length - 2].point
          ) {
            this._segments.pop();
          }
          if (this._segments[0].point == this._segments[1].point) {
            this._segments.shift();
          }
          return;
        }
      }
    }
  }
}
