import { Base, Geometry, Subtraction } from "@react-three/csg";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { CardDimensions, NfcChipState } from "../cardFormTypes";
import useMeshStore from "@/store/meshStore";

export const roundedRectShape = (w: number, h: number, r: number) => {
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

const CardMesh = ({
  cardProps,
  nfcChipProps,
}: {
  cardProps: CardDimensions;
  nfcChipProps: NfcChipState;
}) => {
  const cardGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(
      roundedRectShape(
        cardProps.width,
        cardProps.height,
        cardProps.borderRadius,
      ),
      { depth: cardProps.thickness, bevelEnabled: false, curveSegments: 24 },
    );
    geometry.center();

    return geometry;
  }, [
    cardProps.width,
    cardProps.height,
    cardProps.thickness,
    cardProps.borderRadius,
  ]);

  const nfcGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(
      roundedRectShape(
        nfcChipProps.diameter,
        nfcChipProps.diameter,
        nfcChipProps.diameter,
      ),
      { depth: nfcChipProps.thickness, bevelEnabled: false, curveSegments: 24 },
    );

    geometry.center();

    return geometry;
  }, [nfcChipProps.diameter, nfcChipProps.thickness]);

  const [cardMeshRef, setCardMeshRef] = useState<THREE.Mesh | null>(null);
  const { setCardMesh } = useMeshStore();

  useEffect(() => {
    if (!cardMeshRef) return;

    setCardMesh(cardMeshRef);
  }, [cardMeshRef, setCardMesh]);

  return (
    <mesh ref={setCardMeshRef}>
      <meshBasicMaterial color="white" />
      <Geometry>
        <Base geometry={cardGeometry}></Base>
        <Subtraction
          position={[
            nfcChipProps.xPosition,
            nfcChipProps.yPosition,
            nfcChipProps.zPosition,
          ]}
          geometry={nfcGeometry}
        />
      </Geometry>
    </mesh>
  );
};

export default CardMesh;
