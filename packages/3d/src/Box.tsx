import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useOnCanvasResize } from "./useOnCanvasResize";

export function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useOnCanvasResize(({ aspect }) => {
    mesh.current.scale.set(aspect, aspect, aspect);
  });
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
