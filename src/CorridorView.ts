import { Corridor } from 'rot-js/lib/map/features';
import { Rect } from "./core/Rect";

export type CorridorView = {
    view: PIXI.Container;
    corridor: Corridor;
    rect: Rect;
};
