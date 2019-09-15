import * as PIXI from "pixi.js"
import { Colors , ColorUtils} from './core/Colors'
import { Slider } from './blocks/Slider'
import { Random } from './core//Random';

export class Game {
    private stage: PIXI.Container;

    constructor(stage: PIXI.Container) {
        this.stage = stage;
    }

    init() {
        const gap = 50;
        for (let i = gap; i < window.innerWidth; i+=gap*2) {
            if (i + gap < window.innerWidth) {
                this.addSlider(i, gap);
            }
        }
        
    }

    addSlider(x: number, gap: number) {
        var slider = new Slider(
            gap, 
            window.innerHeight - 2*gap,
            ColorUtils.random().color, 
            Colors.BlueGrey.C300,
            Random.between(1, 4)).view;
        slider.position.set(x, gap);
        this.stage.addChild(slider);
    }
}