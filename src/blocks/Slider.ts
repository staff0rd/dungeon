import * as PIXI from "pixi.js"
import { Colors } from "../core/Colors";
import * as gsap from "gsap"

export class Slider {
    public view: PIXI.Container;
    private width: number;
    private height: number;
    private color: number;
    private borderColor: number;
    private foreground: PIXI.Graphics;
    private target: number;
    private speed: number;

    constructor(width: number, height: number, color: number, borderColor: number, speed: number) {
        this.view = new PIXI.Container();
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
        this.view.interactive = true;
        this.view.buttonMode = true;
        this.speed = speed;
        this.view.on("pointerdown", (e: PIXI.interaction.InteractionEvent) => {
            var local = e.data.getLocalPosition(this.view);
            this.updateTarget(this.height - local.y);
        })
        this.draw();
    }

    private updateTarget(y: number) {
        console.log(y);
        this.target = y / this.height;
        gsap.TweenMax.to(this.foreground.scale, this.speed, {y: this.target});
    }

    private draw() {
        const foreground = new PIXI.Graphics();
        foreground.beginFill(this.color);
        foreground.drawRect(0, 0, this.width, this.height);
        foreground.endFill();
        foreground.pivot.y = this.height;
        foreground.position.y = this.height;
        this.foreground = foreground;
        
        const background = new PIXI.Graphics();
        background.beginFill(Colors.LightBlue.C300, 0.001);
        background.lineStyle(2, this.borderColor);
        background.drawRect(0, 0, this.width, this.height);
        background.endFill();
        
        this.view.addChild(background, foreground);
    }
}