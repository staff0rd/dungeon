import * as PIXI from "pixi.js"
import { Colors } from './core/Colors'

export class Game {
    private stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    init() {
        var g = new PIXI.Graphics();
        g.beginFill(Colors.Yellow.C500);
        g.drawRect(0, 0, 100, 100);
        g.endFill();
        this.stage.addChild(g);
        g.position.set(100);
    }
}