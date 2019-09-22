import * as PIXI from "pixi.js"
import { Random } from './core//Random';
import { RNG } from "rot-js";
import { Analytics } from "./core/Analytics"
import { DungeonMap } from "./DungeonMap";

export class Game {
    private pixi: PIXI.Application;
    private interactionHitBox: PIXI.Graphics;
    private dungeonMap: DungeonMap;

    constructor(pixi: PIXI.Application) {
        this.pixi = pixi;
        this.initInteraction();

        this.dungeonMap = new DungeonMap(60, 30);
        
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
        
        this.dungeonMap.generate();

        const startingRoom = Random.pick(this.dungeonMap.rooms);
        
        this.pixi.stage.addChild(this.dungeonMap.view);
    }
}