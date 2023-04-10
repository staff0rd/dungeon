import React from "react";
import ReactDOM from "react-dom";
import { Analytics } from "../../core/Analytics";
import { App } from "./components/App";
import "./index.css";

interface Window {
  uid: string;
  buildId: string;
}

declare var window: Window;

Analytics.create(window.uid, "dungeon", window.buildId);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
