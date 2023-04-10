import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera } from "three";
import { Random } from "../../core/Random";
import { Box } from "./Box";
import Config from "./Config";
import { DungeonMap } from "./DungeonMap";
import { useOnCanvasResize } from "./useOnCanvasResize";

const map = new DungeonMap(Config);
const seed = Config.seed || Random.between(1, 100000);
map.generate(seed);

export const App = () => {
  const group1 = useRef<THREE.Group>(null!);
  // const map = useMap();
  console.log(map.rooms.map((p) => `${p.rect.x},${p.rect.y}`));
  const { gl, camera } = useThree();
  useOnCanvasResize(({ width, height, aspect }) => {
    gl.setSize(
      width / window.devicePixelRatio,
      height / window.devicePixelRatio,
      false
    );
    camera.position.z = -50;
    group1.current?.add(camera);

    group1.current.rotation.y = Math.PI * 1.2;

    camera.lookAt(20, 20, 0);
    (camera as PerspectiveCamera).aspect = aspect;
    camera.updateProjectionMatrix();
    gl.setPixelRatio(window.devicePixelRatio);
    console.log("ratio", gl.pixelRatio);
  });

  useFrame((_, delta) => {
    group1.current.rotation.x = Math.PI;
    group1.current.position.y = 30;
    //group1.current.rotation.x = Math.PI;
    console.log(group1.current.rotation.x / Math.PI);
  });

  return (
    <>
      <group ref={group1}></group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {map.rooms.map((room, ix) => {
        return (
          <Box
            key={ix}
            position={[room.rect.x, room.rect.y, 1]}
            width={room.rect.width}
            height={room.rect.height}
            color={room.color}
          />
        );
      })}
    </>
  );
};
