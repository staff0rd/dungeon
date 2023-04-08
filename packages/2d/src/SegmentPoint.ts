import { Structure } from "./Structure";

export class SegmentPoint {
  point: number;
  type: Structure;
  constructor(point: number, type: Structure) {
    this.point = point;
    this.type = type;
  }
}
