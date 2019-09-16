import * as PIXI from "pixi.js"
import { Colors , ColorUtils} from './core/Colors'
import { Random } from './core//Random';
import { RNG, Map } from "rot-js";

export class Game {
    private stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    init() {
        RNG.setSeed(Random.between(1, 100000));
        var map = new Map.Digger(60, 30, {})
        map.create();

        var rooms = map.getRooms();
        var corridors = map.getCorridors();
        var dungeon = new PIXI.Container();


        for (var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            const x = room.getLeft();
            const y = room.getTop();
            const width = room.getRight() - x + 1;
            const height = room.getBottom() - y + 1;

            const g = new PIXI.Graphics();
            g.beginFill(ColorUtils.random().color);
            g.drawRect(x, y, width, height);
            g.endFill();
            dungeon.addChild(g);
            room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                g.beginFill(Colors.BlueGrey.C100);
                g.drawRect(x, y, 1, 1);
                g.endFill();
                dungeon.addChild(d);
            })
        }
        for (var i = 0; i< corridors.length; i ++) {
            var corridor = corridors[i];

            const rect = {
                x: Math.min(corridor._startX, corridor._endX),
                y: Math.min(corridor._startY, corridor._endY),
                width: Math.abs(corridor._endX - corridor._startX) + 1,
                height: Math.abs(corridor._endY - corridor._startY) + 1
            };

            const g = new PIXI.Graphics();
            g.beginFill(Colors.BlueGrey.C500);
            g.drawRect(rect.x, rect.y, rect.width, rect.height);
            g.endFill();
            dungeon.addChild(g);
            console.log(rect);
        }




        dungeon.scale.set(15);
        this.stage.addChild(dungeon);
    }
}