import { Canvas } from "@react-three/fiber";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Canvas className="canvas">
    <App />
  </Canvas>
);
