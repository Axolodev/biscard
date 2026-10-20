import { Text3D } from "@react-three/drei";
import { TextBlockState } from "../cardFormTypes";
import useMeshStore from "@/store/meshStore";
import * as THREE from "three";
import { useEffect, useState } from "react";

const TextBlockMesh = ({
  textBlockProps,
}: {
  textBlockProps: TextBlockState;
}) => {
  const [textMeshRef, setTextMeshRef] = useState<THREE.Mesh | null>(null);
  const { setTextMesh } = useMeshStore();

  useEffect(() => {
    if (!textMeshRef) return;

    setTextMesh(textMeshRef);
  }, [textMeshRef, setTextMesh]);

  return (
    <Text3D
      ref={setTextMeshRef}
      font={`/fonts/${textBlockProps.fontFamily}.json`}
      size={textBlockProps.fontSize / 4}
      position={[
        textBlockProps.xPosition,
        textBlockProps.yPosition,
        textBlockProps.zPosition,
      ]}
      lineHeight={textBlockProps.lineHeight}
      height={textBlockProps.thickness}
      castShadow={false}
    >
      {textBlockProps.content}
      <meshBasicMaterial color="black" />
    </Text3D>
  );
};

export default TextBlockMesh;
