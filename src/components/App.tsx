import * as React from "react";
import * as PIXI from "pixi.js"
import { Colors } from '../core/Colors'
import { Game } from '../Game'
import { Config } from '../Config'
import { Browser } from "../core/Browser";
import { Random } from "../core/Random";

export interface AppProps { compiler: string; framework: string; }

export interface AppState {  }

export class App extends React.Component<AppProps, AppState> {
    pixiElement: HTMLDivElement;
    app: PIXI.Application;
    game: Game;

    getConfig() {
        const config = new Config();
        config.seed =  Browser.getQueryNumber("seed");
        config.roomNumbers = Browser.getQueryBoolean("roomNumbers", false);
        config.corridorNumbers = Browser.getQueryBoolean("corridorNumbers", false);
        config.passable = Browser.getQueryBoolean("passable", false);
        config.hideWalls = Browser.getQueryBoolean("hideWalls", false);
        config.corridor = Browser.getQueryNumber("corridor");
        return config;
    }
    
    pixiUpdate = (element: HTMLDivElement) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: Colors.BlueGrey.C900 });
            this.pixiElement.appendChild(this.app.view);
            this.game = new Game(this.getConfig(), this.app);
            this.game.init();
        }
    }

    render() {
        return (<div>
            <div ref={this.pixiUpdate} />
        </div>
        );
    }
}