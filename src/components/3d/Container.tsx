import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import useMeshStore from "@/store/meshStore";
import useModelStore from "@/store/modelStore";
import { Suspense, useEffect, useState } from "react";
import CardMesh from "./CardMesh";
import QRCodeMesh from "./QRCodeMesh";
import TextBlockMesh from "./TextBlockMesh";

const Container = () => {
  const { card, textBlock, qrCode, nfcChip } = useModelStore((s) => s.form);

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
          <CardMesh cardProps={card} nfcChipProps={nfcChip} />

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
