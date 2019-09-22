import * as React from "react";
import * as ReactDOM from "react-dom";
import {Analytics} from './core/Analytics';
import { App } from "./components/App";

Analytics.create("#{uid}#", "dungeon", "#{Build.BuildId}#")

ReactDOM.render(
    <App compiler="TypeScript" framework="React" />,
    document.getElementById('react-app')
);