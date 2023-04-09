import { useFrame, useThree } from "@react-three/fiber";

export const useOnCanvasResize = (
  onResize: (props: { width: number; height: number; aspect: number }) => void
) => {
  const { gl } = useThree();
  useFrame(() => {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      const aspect = width / height;
      onResize({ width, height, aspect });
    }
  });
};
