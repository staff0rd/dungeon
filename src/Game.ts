import * as PIXI from "pixi.js"
import { Colors , ColorUtils} from './core/Colors'
import { Random } from './core//Random';
import { RNG, Map } from "rot-js/lib";

export class Game {
    private stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    init() {
        RNG.setSeed(Random.between(1, 100000));
        var map = new Map.Digger(50, 50, {})
        map.create();

        var rooms = map.getRooms();
        var corridors = map.getCorridors();
        var dungeon = new PIXI.Container();

        for (var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            const x = room.getLeft();
            const y = room.getTop();
            const width = room.getRight() - x;
            const height = room.getBottom() - y;

            const g = new PIXI.Graphics();
            g.beginFill(ColorUtils.random().color);
            g.drawRect(x, y, width, height);
            g.endFill();
            dungeon.addChild(g);
            room.getDoors(console.log);
        }
        for (var i = 0; i< corridors.length; i ++) {
            var corridor = corridors[i];
         
            console.log(corridor);
        }


        dungeon.scale.set(15);
        this.stage.addChild(dungeon);
    }
}