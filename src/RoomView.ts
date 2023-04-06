import { Room } from "rot-js/lib/map/features";
import { Color } from "./core/Colors";
import { Rect } from "./core/Rect";

export type RoomView = {
  view: PIXI.Container;
  room: Room;
  number: number;
  rect: Rect;
  color: Color;
};
