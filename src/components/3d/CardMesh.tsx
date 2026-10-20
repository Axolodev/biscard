import { Base, Geometry } from "@react-three/csg";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { CardDimensions } from "../cardFormTypes";
import useMeshStore from "@/store/meshStore";

export const roundedRectShape =(w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  const x = -w / 2;
  const y = -h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + w, y + h - r);
  shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + h);
  shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
};

const CardMesh = ({ cardProps }: { cardProps: CardDimensions }) => {
  const cardGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(
      roundedRectShape(
        cardProps.width,
        cardProps.height,
        cardProps.borderRadius,
      ),
      { depth: cardProps.thickness, bevelEnabled: false, curveSegments: 24 },
    );
    geometry.translate(0, 0, -cardProps.thickness / 2);
    return geometry;
  }, [
    cardProps.width,
    cardProps.height,
    cardProps.thickness,
    cardProps.borderRadius,
  ]);

  const [cardMeshRef, setCardMeshRef] = useState<THREE.Mesh | null>(null);
  const { setCardMesh } = useMeshStore();

  useEffect(() => {
    if (!cardMeshRef) return;

    setCardMesh(cardMeshRef);
  }, [cardMeshRef, setCardMesh]);

  // TODO: Subtract NFC slot from card mesh when enabled.
  return (
    <mesh ref={setCardMeshRef}>
      <meshBasicMaterial color="white" />
      <Geometry>
        <Base geometry={cardGeometry} />
      </Geometry>
    </mesh>
  );
};

export default CardMesh;
