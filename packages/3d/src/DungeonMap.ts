import { Map, RNG } from "rot-js";
import Dungeon from "rot-js/lib/map/dungeon";
import { Room } from "rot-js/lib/map/features";
import { ColorUtils } from "../../core/Colors";
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

export class DungeonMap {
  data!: PointValue<number>[];
  private map!: Dungeon;
  rooms = [] as RoomStructure[];

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
  }

  private createMap() {
    this.map = new Map.Digger(this.config.width, this.config.height, {});
    this.data = [];
    this.map.create((x: number, y: number, value: number) => {
      this.data.push({ x, y, value });
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
