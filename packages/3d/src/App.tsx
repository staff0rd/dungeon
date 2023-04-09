import { useThree } from "@react-three/fiber";
import { Box } from "./Box";
import { useOnCanvasResize } from "./useOnCanvasResize";

export const App = () => {
  const { gl, camera } = useThree();
  useOnCanvasResize(({ width, height, aspect }) => {
    gl.setSize(width, height, false);
    // @ts-expect-error
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  });
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} />
    </>
  );
};
