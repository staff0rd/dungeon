import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useOnCanvasResize } from "./useOnCanvasResize";

type Props = ThreeElements["mesh"] & {
  width: number;
  height: number;
  color: number;
};

export function Box({ color, width, height, ...props }: Props) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useOnCanvasResize(({ aspect }) => {
    mesh.current.scale.set(aspect, aspect, aspect);
  });
  useFrame((state, delta) => {
    //mesh.current.rotation.x += delta;
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
      <boxGeometry args={[width, height, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
