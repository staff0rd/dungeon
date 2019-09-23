import * as PIXI from "pixi.js"
import { Random } from './core//Random';
import { RNG } from "rot-js";
import { Analytics } from "./core/Analytics"
import { DungeonMap, Point } from "./DungeonMap";
import { Colors } from './core/Colors';
import { Config } from './Config'

export class Game {
    private pixi: PIXI.Application;
    private interactionHitBox: PIXI.Graphics;
    private dungeonMap: DungeonMap;
    private pointerBlock: PIXI.Graphics;
    private lastPoint: Point;
    private config: Config;

    constructor(config:Config, pixi: PIXI.Application) {
        this.pixi = pixi;
        this.config = config;
        this.initInteraction();

        this.dungeonMap = new DungeonMap(60, 30, config.roomNumbers, config.scale);
        
        this.initPointer();

        window.onresize = () => {
            this.pixi.view.width = window.innerWidth;
            this.pixi.view.height = window.innerHeight;
            this.interactionHitBox.width = window.innerWidth;
            this.interactionHitBox.height = window.innerHeight;
        }
    }

    initPointer() {
        const g = new PIXI.Graphics();
        g.beginFill(Colors.Red.C100);
        g.alpha = .25;
        g.drawRect(0, 0, 1, 1);
        g.endFill();
        this.pointerBlock = g;
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
        this.interactionHitBox.on('pointermove', (e: PIXI.interaction.InteractionEvent) => this.pointerMove(e));
        this.interactionHitBox.alpha = 0;
    }

    pointerMove(e: PIXI.interaction.InteractionEvent): any {
        const position = e.data.getLocalPosition(this.dungeonMap.view);
        const x = Math.floor(position.x), y = Math.floor(position.y);
        console.log('pos', x, y);
        const point = this.dungeonMap.getPoint(x,y);
        if (point != this.lastPoint) {
            this.pointerBlock.position.set(x, y);
            console.log(point);
            this.lastPoint = point;
        }
    }

    setSeed() {
        const seed = this.config.seed || Random.between(1, 100000);

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
        
        this.dungeonMap.generate();

        const startingRoom = Random.pick(this.dungeonMap.rooms);

        this.dungeonMap.view.addChild(this.pointerBlock);

        this.pixi.stage.addChild(this.dungeonMap.view);
    }
}