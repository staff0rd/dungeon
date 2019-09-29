import { SegmentPoint } from "./SegmentPoint";
import { Structure } from "./Structure";
import { Segment } from "./Segment";
import { Rect } from "./core/Rect";
import { Direction } from "./core/Direction";

export class Edge {
    get segmentPoints() {
        return this._segments;
    }

    toString() {
        return '[' + this.segmentPoints.map(sp => `(${sp.point}, ${sp.type})`).join(', ') + ']';
    }

    join(second: Edge): any {
        this._segments.pop();
        second.segmentPoints.shift();
        this._segments = this._segments.concat(second.segmentPoints);
        //console.log(this.toString())
    }

    private _segments: SegmentPoint[];
    private _type: Structure;
    private _rect: Rect;
    private _direction: Direction;

    get rect() {
        return this._rect;
    }

    get direction() {
        return this._direction;
    }

    get start() {
        return this._segments[0].point;
    }
    get end() {
        return this._segments[this._segments.length - 1].point;
    }

    set end(point: number) {
        this._segments[this._segments.length - 1].point = point;
    }

    constructor(rect: Rect, direction: Direction, type?: Structure) {
        this._segments = [new SegmentPoint(rect.from(direction), type), new SegmentPoint(rect.to(direction), type)];
        this._type = type;
        this._direction = direction;
        this._rect = rect;
    }

    get segments() {
        const segments: Segment[] = [];
        for (let i = 1; i < this._segments.length; i++) {
            if (this._segments[i-1].type == this._type) {
                segments.push(new Segment(this._segments[i-1].point, this._segments[i].point));
            }
        }
        return segments;
    }

    insert(p1: number, p2: number, type: Structure) {
        for (let i = 0; i < this._segments.length; i++){
            if (!this._segments[i+1] || this._segments[i+1].point > p1) {
                const from = p1;
                const to = p2;
                this._segments.splice(i + 1, 0, new SegmentPoint(from, type), new SegmentPoint(to, this._segments[i].type));
                return;
            }
        }
    }
}
