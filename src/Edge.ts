import { SegmentPoint } from "./SegmentPoint";
import { Structure } from "./Structure";
import { Segment } from "./Segment";

export class Edge {
    private _segments: SegmentPoint[];
    private _type: Structure;

    get start() {
        return this._segments[0].point;
    }
    get end() {
        return this._segments[this._segments.length - 1].point;
    }

    constructor(p1: number, p2: number, type: Structure) {
        this._segments = [new SegmentPoint(p1, type), new SegmentPoint(p2, type)];
        this._type = type;
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
                console.log('adding', from, to, this._segments)
                this._segments.splice(i + 1, 0, new SegmentPoint(from, type), new SegmentPoint(to, this._segments[i].type));
                return;
            }
        }
    }
}
