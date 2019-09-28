export class Rect {

    private _x : number;
    public get x1() : number {
        return this._x;
    }
    
    private _y : number;
    public get y1() : number {
        return this._y;
    }

    private _width : number;
    public get width() : number {
        return this._width;
    }
    
    private _height : number;
    public get height() : number {
        return this._height;
    }

    public get x2() {
        return this._x + this._width;
    }

    public get y2() { 
        return this._y + this._height;
    }

    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
};
