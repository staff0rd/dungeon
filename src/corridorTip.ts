import { Tip } from "./Tip";
import { Segment } from "./Segment";
import { Direction } from "./core/Direction";
import { Edge } from "./Edge";

export const corridorEndTip = (s: Segment, ix: number, edge: Edge, direction: Direction, isTraversable: (x: number, y: number) => boolean) => {
    switch (direction) {
        case (Direction.Top): {
            if (isTraversable(s.to + 1, edge.rect.y1))
                return Tip.Contract;
            else if (isTraversable(s.to + 1, edge.rect.y1))
                return Tip.Flat;
            else
                return Tip.Extend;
        }
    }
};

export const corridorStartTip = (s: Segment, ix: number, edge: Edge, direction: Direction, isTraversable: (x: number, y: number) => boolean) => {
    switch (direction) {
        case Direction.Top: {
            if (!isTraversable(s.from - 1, edge.rect.y1 - 1))
                return Tip.Extend;
            else
                return Tip.Contract;
        }
    }
    return Tip.Flat;
};
