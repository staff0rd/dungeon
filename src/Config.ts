export class Config {
    seed?: number;
    roomNumbers = false;
    corridorNumbers = false;
    passable = false;
    scale = Config.getQueryNumber('scale', 20);
    hideWalls = false;
    corridor?: number;
    width = 60;
    height = 30;
    wallNumbers = false;
    roomThoughfare = false;
    sameColorWalls = false;

    static getQueryStringParameter(name: string) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        if (results !== null) 
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    static getQueryString(name : string, defaultValue?: string) {
        var result = this.getQueryStringParameter(name);
        return result || defaultValue;
    }

    static getQueryNumber(name: string, defaultValue?: number) {
        var result = this.getQueryStringParameter(name);
        return result !== undefined ? Number(result) : defaultValue;
    }
}