import * as PIXI from "pixi.js"
import { Colors , ColorUtils} from './core/Colors'
import { Random } from './core//Random';
import { RNG, Map } from "rot-js";
import { Analytics } from "./core/Analytics"

export class Game {
    private pixi: PIXI.Application;
    private interactionHitBox: PIXI.Graphics;

    constructor(pixi: PIXI.Application) {
        this.pixi = pixi;
        this.initInteraction();        
        
        window.onresize = () => {
            this.pixi.view.width = window.innerWidth;
            this.pixi.view.height = window.innerHeight;
            this.interactionHitBox.width = window.innerWidth;
            this.interactionHitBox.height = window.innerHeight;
        }
    }

    initInteraction() {
        this.pixi.stage.interactive =true;
        this.interactionHitBox = new PIXI.Graphics();
        this.interactionHitBox.beginFill();
        this.interactionHitBox.drawRect(0, 0, 1, 1);
        this.interactionHitBox.endFill();
        this.interactionHitBox.width = window.innerWidth;
        this.interactionHitBox.height = window.innerHeight;
        this.interactionHitBox.interactive = true;
        this.interactionHitBox.on('pointertap', () => this.init());
        this.interactionHitBox.alpha = 0;
    }

    setSeed() {
        const seed = Random.between(1, 100000);
        RNG.setSeed(seed);

        var text = new PIXI.Text(seed.toString());
        text.position.set(10, window.innerHeight - text.height - 10);
        this.pixi.stage.addChild(text);
    }

    init() {
        Analytics.buttonClick("rengenerate");
        this.pixi.stage.removeChildren();
        this.pixi.stage.addChild(this.interactionHitBox);
        this.setSeed();
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
            g.beginFill(ColorUtils.random("BlueGrey").color);
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
        }
        dungeon.scale.set(15);
        this.pixi.stage.addChild(dungeon);
    }
}