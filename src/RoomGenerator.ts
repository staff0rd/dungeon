import { RoomView } from "./blocks/RoomView";
import { Stairs } from './blocks/Stairs';
import { Throughfare } from './blocks/Throughfare';
import { Random } from "./core/Random";
import { Rect } from "./core/Rect";
import { StairDirection } from "./blocks/StairDirection";

export class RoomGenerator {
    private canTraverse: (x: number, y: number) => boolean;
    private scale: number;
    private showThroughfare = false;
    constructor(scale: number, canTraverse: (x: number, y: number) => boolean, showThroughfare: boolean) {
        this.canTraverse = canTraverse;
        this.scale = scale;
        this.showThroughfare = showThroughfare;
    }

    generate(rooms: RoomView[]) {
        for(let room of rooms)
            this.generateThroughfare(room);

        let roomIds = rooms.map(r => r.number);
        
        const stairsUpRoomId = Random.pick(roomIds);
        roomIds = roomIds.filter(id => id != stairsUpRoomId);
        this.placeStairs(rooms.filter(p => p.number == stairsUpRoomId)[0], StairDirection.Up);
        
        const stairsDownRoomId = Random.pick(roomIds);
        roomIds = roomIds.filter(id => id != stairsDownRoomId);
        this.placeStairs(rooms.filter(p => p.number == stairsDownRoomId)[0], StairDirection.Down);

        for(let room of rooms)
            this.draw(room);
    }

    draw(room: RoomView) {
        room.objects.forEach(obj => {
            if (!(obj instanceof Throughfare) || this.showThroughfare)
                room.view.addChild(obj.draw(this.scale));
        });
    }

    placeStairs(room: RoomView, direction: StairDirection) {
        const location = Random.pick(room.getPotentialLocations(2, 1).concat(room.getPotentialLocations(1,2)));
        const stairs = new Stairs(location, direction);
        room.objects.push(stairs);
        this.placeThroughfare(room, stairs.grow(1));
    }

    private placeThroughfare(room: RoomView, rect: Rect) {
        for (let x = rect.x1; x < rect.x2; x++)
        for (let y = rect.y1; y < rect.y2; y++) {
            if (room.rect.inside(x,y) && !room.blocked(x, y)) {
                room.objects.push(new Throughfare(x, y));
            }
        }
    }





    private generateThroughfare(room: RoomView) {
        for (let y = room.rect.top; y < room.rect.bottom; y++) {
            if (this.canTraverse(room.rect.x - 1, y)) {
                room.objects.push(new Throughfare(room.rect.x, y));
            }
            if (this.canTraverse(room.rect.x2, y)) {
                room.objects.push(new Throughfare(room.rect.x2 -1, y));
            }
        }
        for (let x = room.rect.left; x < room.rect.right; x++) {
            if (this.canTraverse(x, room.rect.y - 1)) {
                room.objects.push(new Throughfare(x, room.rect.y));
            }
            if (this.canTraverse(x, room.rect.y2)) {
                room.objects.push(new Throughfare(x, room.rect.y2-1));
            }
        }
    }
}
