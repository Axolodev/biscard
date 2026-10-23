import { Text3D } from "@react-three/drei";
import { CardDimensions, TextBlockState } from "../cardFormTypes";
import useMeshStore from "@/store/meshStore";
import * as THREE from "three";
import { useEffect, useState } from "react";

const TextBlockMesh = ({
  textBlockProps,
  cardProps,
}: {
  textBlockProps: TextBlockState;
  cardProps: CardDimensions;
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
        cardProps.thickness / 2,
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
