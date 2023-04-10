import { useFrame, useThree } from "@react-three/fiber";
export const SCALE = 5;
export const useOnCanvasResize = (
  onResize: (props: { width: number; height: number; aspect: number }) => void
) => {
  const { gl } = useThree();
  useFrame(() => {
    const canvas = gl.domElement;
    const width = canvas.clientWidth * SCALE;
    const height = canvas.clientHeight * SCALE;
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      console.log(
        `Want: ${width}x${height}, have: ${canvas.width}x${canvas.height}`
      );
      const aspect = width / height;
      onResize({ width, height, aspect });
    }
  });
};
