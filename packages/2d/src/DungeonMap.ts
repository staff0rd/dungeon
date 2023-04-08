import * as PIXI from "pixi.js";
import { Map, RNG } from "rot-js";
import { default as Dungeon } from "rot-js/lib/map/dungeon";
import { Config } from "./Config";
import { Color, Colors, ColorUtils } from "./core/Colors";
import { Direction } from "./core/Direction";
import { PointValue } from "./core/PointValue";
import { Rect } from "./core/Rect";
import { CorridorView } from "./CorridorView";
import { DoorView } from "./DoorView";
import { Edge } from "./Edge";
import { EdgeManager } from "./EdgeManager";
import { RoomView } from "./RoomView";
import { Segment } from "./Segment";
import { WallBuilder } from "./WallBuilder";
import { EndTip, StartTip } from "./WallTip";
import { Plane } from "./core/Plane";
import { Structure } from "./Structure";
import { Tip } from "./Tip";

const ROOM_SHADE_INDEX = 3;

export class DungeonMap {
  view: PIXI.Container;
  data!: PointValue<number>[];
  rooms!: RoomView[];
  doors!: DoorView[];
  walls!: PIXI.Container;
  corridors!: CorridorView[];
  private map!: Dungeon;
  private width: number;
  private height: number;
  private scale: number;
  private wallBuilder: WallBuilder;
  private edgeManager: EdgeManager;
  private config: Config;

  constructor(config: Config) {
    this.width = config.width;
    this.height = config.height;
    this.scale = config.scale;
    this.wallBuilder = new WallBuilder(this.scale);
    this.view = new PIXI.Container();
    this.edgeManager = new EdgeManager((x, y) => this.isTraversable(x, y));
    this.config = config;
  }

  setSeed(seed: number) {
    RNG.setSeed(seed);
  }

  generate(seed: number) {
    this.setSeed(seed);

    this.view.removeChildren();

    this.createMap();

    this.buildRooms();

    this.buildCorridors();

    this.walls = new PIXI.Container();

    this.drawDoors();

    if (!this.config.hideWalls) {
      this.placeRoomWalls();

      this.placeCorridorWalls();

      this.view.addChild(this.walls);
    }

    this.drawPassable();

    this.highlightCorridor();
  }

  private highlightCorridor() {
    if (this.config.corridor) {
      const rect = this.corridors[this.config.corridor - 1].rect;
      const g = new PIXI.Graphics();
      g.lineStyle(2, Colors.Black);
      g.drawRect(
        rect.x * this.scale,
        rect.y * this.scale,
        rect.width * this.scale,
        rect.height * this.scale
      );
      this.view.addChild(g);
    }
  }

  private drawDoors() {
    let ix = 1;
    this.doors = [];
    this.rooms.forEach((room) => {
      room.room.getDoors((x: number, y: number) => {
        const plane =
          y < room.rect.top || y >= room.rect.bottom
            ? Plane.Horizontal
            : Plane.Vertical;
        const door = new DoorView(x, y, plane, this.scale, ix);
        if (
          this.getDoor(x, y) ||
          this.corridors.filter((p) => p.rect.intersects(door.rect))[0]
        )
          return;
        ix++;
        this.doors.push(door);
        door.draw();
        room.view.addChild(door.view);
        const color = Colors.Brown.color();
        if (plane == Plane.Horizontal) {
          this.walls.addChild(
            this.wallBuilder.build(
              door.rect,
              color,
              Tip.Contract,
              Tip.Contract,
              Direction.Left
            )
          );
          this.walls.addChild(
            this.wallBuilder.build(
              door.rect,
              color,
              Tip.Contract,
              Tip.Contract,
              Direction.Right
            )
          );
        } else {
          this.walls.addChild(
            this.wallBuilder.build(
              door.rect,
              color,
              Tip.Contract,
              Tip.Contract,
              Direction.Top
            )
          );
          this.walls.addChild(
            this.wallBuilder.build(
              door.rect,
              color,
              Tip.Contract,
              Tip.Contract,
              Direction.Bottom
            )
          );
        }
      });
    });
  }

  private getDoor(x: number, y: number) {
    return this.doors.filter((d) => d.position.x == x && d.position.y == y)[0];
  }

  private drawDoorWall(
    x: number,
    y: number,
    direction: Direction,
    color: Color
  ) {
    const edge = new Edge(new Rect(x, y, 1, 1), direction, Structure.Door);
    edge.segments.forEach(this.drawWalls(edge, color, direction));
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
      const view = new PIXI.Container();
      const g = new PIXI.Graphics();
      g.beginFill(Colors.BlueGrey.C500);
      g.drawRect(
        rect.x1 * this.scale,
        rect.y1 * this.scale,
        rect.width * this.scale,
        rect.height * this.scale
      );
      g.endFill();
      view.addChild(g);
      this.view.addChild(view);
      if (this.config.corridorNumbers) {
        this.addNumber(rect, number, 12);
      }
      return { corridor, view, rect, number };
    });
  }

  private buildRooms() {
    this.rooms = this.map.getRooms().map((room, ix) => {
      const x = room.getLeft();
      const y = room.getTop();
      const width = room.getRight() - x + 1;
      const height = room.getBottom() - y + 1;
      const view = new PIXI.Container();
      const g = new PIXI.Graphics();
      const color = ColorUtils.randomColor("BlueGrey");
      g.beginFill(color.shades[ROOM_SHADE_INDEX].shade);
      g.drawRect(
        x * this.scale,
        y * this.scale,
        width * this.scale,
        height * this.scale
      );
      g.endFill();
      view.addChild(g);
      const number = ix + 1;
      this.view.addChild(view);
      const rect = new Rect(x, y, width, height);
      if (this.config.roomNumbers) {
        this.addNumber(rect, number);
      }
      const result = { room, view, number, rect, color };
      return result;
    });
  }

  createMap() {
    this.map = new Map.Digger(this.width, this.height, {});
    this.data = [];
    this.map.create((x: number, y: number, value: number) => {
      this.data.push({ x, y, value });
    });
  }

  private drawPassable() {
    if (this.config.passable) {
      const fontSize = 10;
      const color = Colors.White;
      const alpha = 0.25;
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (x == 0 || x == this.width - 1) {
            this.addNumber(new Rect(x, y, 1, 1), y, fontSize, color, alpha);
          } else if (y == 0 || y == this.height - 1) {
            this.addNumber(new Rect(x, y, 1, 1), x, fontSize, color, alpha);
          } else {
            const value = this.getPoint(x, y).value;
            this.addNumber(new Rect(x, y, 1, 1), value, fontSize, color, alpha);
          }
        }
      }
    }
  }

  private addNumber(
    rect: Rect,
    number: number,
    fontSize = 20,
    color: number = Colors.Black,
    alpha = 1
  ) {
    const text = new PIXI.Text(number.toString(), {
      fontSize: fontSize,
      fill: color,
    });
    text.alpha = alpha;
    text.position.set(
      (rect.x + rect.width / 2) * this.scale,
      (rect.y + rect.height / 2) * this.scale
    );
    text.pivot.set(text.width / 2, text.height / 2);
    this.view.addChild(text);
  }

  private placeCorridorWalls() {
    const drawCorridorWalls = (direction: Direction) => {
      const color = Colors.BlueGrey.color();
      const edges = this.edgeManager.getCorridorEdges(
        this.corridors,
        direction,
        this.rooms
      );
      edges.forEach((edge) => {
        edge.segments.forEach(this.drawWalls(edge, color, direction));
      });
    };
    drawCorridorWalls(Direction.Left);
    drawCorridorWalls(Direction.Top);
    drawCorridorWalls(Direction.Bottom);
    drawCorridorWalls(Direction.Right);
  }

  private placeRoomWalls() {
    this.rooms.forEach((room) => {
      const drawRoomWalls = (direction: Direction) => {
        const edge = this.edgeManager.getRoomEdge(
          room,
          this.corridors,
          direction
        );
        edge.segments.forEach(this.drawWalls(edge, room.color, direction));
      };
      drawRoomWalls(Direction.Left);
      drawRoomWalls(Direction.Right);
      drawRoomWalls(Direction.Top);
      drawRoomWalls(Direction.Bottom);
    });
  }

  private drawWalls(edge: Edge, color: Color, direction: Direction) {
    if (this.config.sameColorWalls) color = Colors.BlueGrey.color();
    const number = this.walls.children.length + 1;
    return (s: Segment, ix: number, all: Segment[]) => {
      let wallRect: Rect;
      switch (direction) {
        case Direction.Right:
        case Direction.Left: {
          wallRect = new Rect(
            edge.rect.x1,
            s.from,
            edge.rect.width,
            s.to - s.from
          );
          break;
        }
        case Direction.Top:
        case Direction.Bottom: {
          wallRect = new Rect(
            s.from,
            edge.rect.y1,
            s.to - s.from,
            edge.rect.height
          );
          break;
        }
      }

      const g = this.wallBuilder.build(
        wallRect,
        color,
        StartTip(s, ix, edge, direction, (x, y) => this.isTraversable(x, y)),
        EndTip(s, ix, edge, direction, (x, y) => this.isTraversable(x, y)),
        direction,
        this.config.focusWall ? this.config.focusWall === number : undefined
      );

      this.walls.addChild(g);
      if (!this.config.focusWall || this.config.focusWall === number) {
        if (this.config.wallNumbers) {
          const label = new PIXI.Text(number.toString(), {
            fontSize: 12,
            fill: Colors.White,
          });
          label.pivot.set(label.width / 2, label.height / 2);
          label.position.set(g.x + g.width / 2, g.y + g.height / 2);
          this.walls.addChild(label);
        }
      } else g.alpha = 0;
    };
  }

  isTraversable(x: number, y: number) {
    const point = this.getPoint(x, y);
    return !point.value;
  }

  getPoint(x: number, y: number) {
    return this.data[x * this.height + y];
  }
}
