import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CardFormState } from "../cardFormTypes";

import useMeshStore from "@/store/meshStore";
import { Suspense, useEffect, useState } from "react";
import CardMesh from "./CardMesh";
import QRCodeMesh from "./QRCodeMesh";
import TextBlockMesh from "./TextBlockMesh";

interface ContainerProps {
  cardModelProps: CardFormState;
}

const Container = ({ cardModelProps }: ContainerProps) => {
  const { card, textBlock, qrCode } = cardModelProps;

  const { setJointMesh } = useMeshStore();
  const [jointMeshRef, setJointMeshRef] = useState<THREE.Mesh | null>(null);
  const [mycam, setMycam] = useState<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!jointMeshRef) return;

    setJointMesh(jointMeshRef);
  }, [jointMeshRef, setJointMesh]);

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera
          ref={setMycam}
          makeDefault
          position={[0, 0, 100]}
          fov={70}
        />
        {mycam && <CameraControls camera={mycam} />}

        <directionalLight color="white" position={[0, 0, 5]} />
        <group ref={setJointMeshRef}>
          <CardMesh cardProps={card} />

          <Suspense fallback={null}>
            {textBlock.enabled && textBlock.content.length > 0 && (
              <TextBlockMesh textBlockProps={textBlock} />
            )}
          </Suspense>

          <Suspense fallback={null}>
            {qrCode.enabled && qrCode.qrContent.length > 0 && (
              <QRCodeMesh qrCodeProps={qrCode} />
            )}
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
};

export default Container;
