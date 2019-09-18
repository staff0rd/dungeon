import * as React from "react";
import * as PIXI from "pixi.js"
import { Colors } from '../core/Colors'
import { Game } from '../Game'


export interface AppProps { compiler: string; framework: string; }

export interface AppState {  }

export class App extends React.Component<AppProps, AppState> {
    pixiElement: HTMLDivElement;
    app: PIXI.Application;
    game: Game;
    
    pixiUpdate = (element: HTMLDivElement) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: Colors.BlueGrey.C900 });
            this.pixiElement.appendChild(this.app.view);
            this.game = new Game(this.app);
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