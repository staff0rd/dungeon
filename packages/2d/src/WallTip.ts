import { Direction } from "../../core/Direction";
import { Edge } from "./Edge";
import { Segment } from "./Segment";
import { Tip } from "./Tip";

// TODO: door corner 61858, 37261
// TODO: doors

export const StartTip = (
  s: Segment,
  ix: number,
  edge: Edge,
  direction: Direction,
  isTraversable: (x: number, y: number) => boolean
) => {
  switch (direction) {
    case Direction.Top: {
      if (isTraversable(s.from - 1, edge.rect.top - 1)) {
        if (isTraversable(s.from, edge.rect.top - 2)) {
          return Tip.Contract;
        } else return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Bottom: {
      if (isTraversable(s.from - 1, edge.rect.bottom)) {
        if (isTraversable(s.from, edge.rect.bottom + 1)) {
          return Tip.Contract;
        } else return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Left: {
      if (isTraversable(edge.rect.left - 1, s.from - 1)) {
        return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Right: {
      if (isTraversable(edge.rect.right, s.from - 1)) {
        return Tip.Contract;
      } else return Tip.Extend;
    }
  }
};

export const EndTip = (
  s: Segment,
  ix: number,
  edge: Edge,
  direction: Direction,
  isTraversable: (x: number, y: number) => boolean
) => {
  switch (direction) {
    case Direction.Top: {
      if (isTraversable(s.to, edge.rect.top - 1)) {
        if (isTraversable(s.to - 1, edge.rect.top - 2)) {
          return Tip.Contract;
        } else return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Bottom: {
      if (isTraversable(s.to, edge.rect.bottom)) {
        if (isTraversable(s.to - 1, edge.rect.bottom + 1)) {
          return Tip.Contract;
        } else return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Left: {
      if (isTraversable(edge.rect.left - 1, s.to)) {
        return Tip.Contract;
      } else return Tip.Extend;
    }
    case Direction.Right: {
      if (isTraversable(edge.rect.right, s.to)) {
        return Tip.Contract;
      } else return Tip.Extend;
    }
  }
};
