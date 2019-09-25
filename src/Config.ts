import { Browser } from './core/Browser'

export class Config {
    seed =  Browser.getQueryNumber("seed");
    roomNumbers = Browser.getQueryBoolean("roomNumbers", false);
    scale = 20;
    hideWalls = Browser.getQueryBoolean("hideWalls", false);
}