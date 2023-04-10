import { Rect } from "../../core/Rect";
import { RoomView } from "./RoomView";
export function getDoors(roomView: RoomView) {
  const doors: Rect[] = [];
  roomView.room.getDoors((x: number, y: number) =>
    doors.push(new Rect(x, y, 1, 1))
  );
  return doors;
}
