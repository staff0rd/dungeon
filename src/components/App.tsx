import * as React from "react";
import * as PIXI from "pixi.js";
import { Colors } from "../core/Colors";
import { Game } from "../Game";
import { Config } from "../Config";
import { Browser } from "../core/Browser";

export interface AppState {}

export class App extends React.Component<{}, AppState> {
  pixiElement!: HTMLDivElement;
  app!: PIXI.Application;
  game!: Game;

  getConfig() {
    const config = new Config();
    config.seed = Browser.getQueryNumber("seed");
    config.scale = Browser.getQueryNumber("scale", 20)!;
    config.roomNumbers = Browser.getQueryBoolean("roomNumbers", false);
    config.corridorNumbers = Browser.getQueryBoolean("corridorNumbers", false);
    config.passable = Browser.getQueryBoolean("passable", false);
    config.hideWalls = Browser.getQueryBoolean("hideWalls", false);
    config.corridor = Browser.getQueryNumber("corridor");
    config.wallNumbers = Browser.getQueryBoolean("wallNumbers", false);
    config.roomThoughfare = Browser.getQueryBoolean("roomThroughfare", false);
    config.sameColorWalls = Browser.getQueryBoolean("sameColorWalls", false);
    return config;
  }

  pixiUpdate = (element: HTMLDivElement) => {
    this.pixiElement = element;

    if (this.pixiElement && this.pixiElement.children.length <= 0) {
      this.app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: Colors.BlueGrey.C900,
      });
      this.pixiElement.appendChild(this.app.view);
      this.game = new Game(this.getConfig(), this.app);
      this.game.init();
    }
  };

  render() {
    return (
      <div>
        <div ref={this.pixiUpdate} />
      </div>
    );
  }
}
