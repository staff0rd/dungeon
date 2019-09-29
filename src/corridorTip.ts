import { Tip } from "./Tip";
import { Segment } from "./Segment";
import { Direction } from "./core/Direction";
import { Edge } from "./Edge";

export const corridorStartTip = (s: Segment, ix: number, edge: Edge, direction: Direction, isTraversable: (x: number, y: number) => boolean) => {
    switch (direction) {
        case Direction.Top: {
            if (edge.rect.top == 15) {
                console.log(edge.toString(), s.from)
                console.log(s.from- 1, edge.rect.top - 1)

            }
            if (isTraversable(s.from- 1, edge.rect.top - 1)){
                if (isTraversable(s.from, edge.rect.top-2)) {
                    return Tip.Contract;
                } else return Tip.Contract;
            } else return Tip.Extend;
        }
        case Direction.Bottom: {
            if (isTraversable(s.from - 1, edge.rect.bottom)) {
                if (isTraversable(s.from, edge.rect.bottom + 1)) {
                    return Tip.Contract
                } else return Tip.Contract;
            } else return Tip.Extend;
        }
    }
    return Tip.Flat;
};

export const corridorEndTip = (s: Segment, ix: number, edge: Edge, direction: Direction, isTraversable: (x: number, y: number) => boolean) => {
    switch (direction) {
        case (Direction.Top): {
            if (isTraversable(s.to, edge.rect.top - 1)) {
                if (isTraversable(s.to- 1, edge.rect.top - 2)) {
                    return Tip.Contract;
                } else return Tip.Contract;
            } else return Tip.Extend;
        }
        case (Direction.Bottom): {
            if (isTraversable(s.to, edge.rect.bottom)) {
                if (isTraversable(s.to -1, edge.rect.bottom + 1)) {
                    return Tip.Contract;
                } else return Tip.Contract;
            } else return Tip.Extend;
        }
    }
};
