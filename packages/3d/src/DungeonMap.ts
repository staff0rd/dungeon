import { Map, RNG } from "rot-js";
import Dungeon from "rot-js/lib/map/dungeon";
import { Corridor, Room } from "rot-js/lib/map/features";
import { Colors, ColorUtils } from "../../core/Colors";
import { PointValue } from "../../core/PointValue";
import { Rect } from "../../core/Rect";
import Config from "./Config";

const ROOM_SHADE_INDEX = 3;

type RoomStructure = {
  rect: Rect;
  color: number;
  number: number;
  room: Room;
};

type CorridorStructure = {
  rect: Rect;
  number: number;
  corridor: Corridor;
  color: number;
};

export class DungeonMap {
  data!: PointValue<number>[];
  private map!: Dungeon;
  rooms = [] as RoomStructure[];
  corridors = [] as CorridorStructure[];

  constructor(private config: typeof Config) {
    this.config = config;
  }

  setSeed(seed: number) {
    RNG.setSeed(seed);
  }

  generate(seed: number) {
    this.setSeed(seed);

    this.createMap();

    this.buildRooms();

    this.buildCorridors();
  }

  private createMap() {
    this.map = new Map.Digger(this.config.width, this.config.height, {});
    this.data = [];
    this.map.create((x: number, y: number, value: number) => {
      this.data.push({ x, y, value });
    });
  }

  buildCorridors() {
    this.corridors = this.map.getCorridors().map((corridor, ix) => {
      const number = ix + 1;
      const rect = new Rect(
        Math.min(corridor._startX, corridor._endX),
        Math.min(corridor._startY, corridor._endY),
        Math.abs(corridor._endX - corridor._startX) + 1,
        Math.abs(corridor._endY - corridor._startY) + 1
      );

      return { corridor, color: Colors.BlueGrey.C500, rect, number };
    });
  }

  private buildRooms() {
    this.rooms = this.map.getRooms().map((room, ix) => {
      const x = room.getLeft();
      const y = room.getTop();
      const width = room.getRight() - x + 1;
      const height = room.getBottom() - y + 1;

      const color =
        ColorUtils.randomColor("BlueGrey").shades[ROOM_SHADE_INDEX].shade;

      const number = ix + 1;
      const rect = new Rect(x, y, width, height);

      const result: RoomStructure = { room, number, rect, color };
      return result;
    });
  }
}
