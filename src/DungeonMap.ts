import { Map } from "rot-js";
import * as PIXI from "pixi.js";
import { Colors , ColorUtils} from './core/Colors'

export class DungeonMap {
    public view: PIXI.Container;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.view = new PIXI.Container();
    }

    generate() {
        this.view.removeChildren();
        
        var map = new Map.Digger(this.width, this.height, {});
        map.create();

        var rooms = map.getRooms();
        var corridors = map.getCorridors();

        for (var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            const x = room.getLeft();
            const y = room.getTop();
            const width = room.getRight() - x + 1;
            const height = room.getBottom() - y + 1;

            const g = new PIXI.Graphics();
            g.beginFill(ColorUtils.random("BlueGrey").color);
            g.drawRect(x, y, width, height);
            g.endFill();
            this.view.addChild(g);
            room.getDoors((x: number, y: number) => {
                const d = new PIXI.Graphics();
                g.beginFill(Colors.BlueGrey.C100);
                g.drawRect(x, y, 1, 1);
                g.endFill();
                this.view.addChild(d);
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
            this.view.addChild(g);
        }
        this.view.scale.set(15);
    }
}