import { Canvas } from "@react-three/fiber";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Canvas className="canvas" flat linear>
    <App />
  </Canvas>
);
