import * as PIXI from "pixi.js";
import { Colors } from './core/Colors';
import { RoomView } from "./blocks/RoomView";
import { Room } from "rot-js/lib/map/features";
import { Random } from "./core/Random";

export enum RoomObject {
    Throughfare
}

export class RoomGenerator {
    private canTraverse: (x: number, y: number) => boolean;
    private scale: number;
    private showThroughfare = false;
    constructor(scale: number, canTraverse: (x: number, y: number) => boolean, showThroughfare: boolean) {
        this.canTraverse = canTraverse;
        this.scale = scale;
        this.showThroughfare = showThroughfare;
    }
    generate(room: RoomView) {
        this.generateThroughfare(room);
        if (this.showThroughfare) {
            room.objects.forEach(obj => {
                const g = new PIXI.Graphics();
                g.lineStyle(2, Colors.Red.C500)
                g.beginFill(Colors.BlueGrey.C500);
                g.drawCircle(this.scale / 2, this.scale / 2, this.scale / 3);
                room.view.addChild(g);
                g.position.set(obj.x * this.scale, obj.y * this.scale);
            });
        }
    }

    placeStairs(room: RoomView) {
        //Random.pick(this.getPotentialLocations)
    }

    generateThroughfare(room: RoomView) {
        const value = RoomObject.Throughfare;
        for (let y = room.rect.top; y < room.rect.bottom; y++) {
            if (this.canTraverse(room.rect.x - 1, y)) {
                room.objects.push({ x: room.rect.x, y, value});
            }
            if (this.canTraverse(room.rect.x2, y)) {
                room.objects.push({ x: room.rect.x2 - 1, y, value});
            }
        }
        for (let x = room.rect.left; x < room.rect.right; x++) {
            if (this.canTraverse(x, room.rect.y - 1)) {
                room.objects.push({x, y: room.rect.y, value})
            }
            if (this.canTraverse(x, room.rect.y2)) {
                room.objects.push({x, y: room.rect.y2-1, value});
            }
        }
    }
}
