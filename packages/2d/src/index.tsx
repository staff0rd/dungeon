import * as React from "react";
import * as ReactDOM from "react-dom";
import { Analytics } from "./core/Analytics";
import { App } from "./components/App";

interface Window {
  uid: string;
  buildId: string;
}

declare var window: Window;

Analytics.create(window.uid, "dungeon", window.buildId);

ReactDOM.render(<App />, document.getElementById("react-app"));
