import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import useMeshStore from "@/store/meshStore";
import useFormStateStore from "@/store/formStateStore";
import { Suspense, useEffect, useState } from "react";
import CardMesh from "./CardMesh";
import QRCodeMesh from "./QRCodeMesh";
import TextBlockMesh from "./TextBlockMesh";
import ErrorBoundary from "./ErrorBoundary";
import { useTranslations } from "next-intl";

const RTFContainer = () => {
  const { card, textBlock, qrCode, nfcChip } = useFormStateStore((s) => s.form);
  const { resetValues } = useFormStateStore();
  const t = useTranslations("visualizer");

  const { setJointMesh, setCameraControls } = useMeshStore();
  const [jointMeshRef, setJointMeshRef] = useState<THREE.Mesh | null>(null);
  const [mycam, setMycam] = useState<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!jointMeshRef) return;

    setJointMesh(jointMeshRef);
  }, [jointMeshRef, setJointMesh]);

  return (
    <div className="w-full h-full">
      <ErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[80%] text-center flex flex-col items-center justify-center gap-4">
              <p className="text-xl">{t("error")}</p>
              <button
                className="ml-4 btn btn-primary"
                onClick={() => {
                  resetValues();
                }}
              >
                {t("errorCTA")}
              </button>
            </div>
          </div>
        }
      >
        <Canvas>
          <PerspectiveCamera
            ref={setMycam}
            makeDefault
            position={[0, 0, 100]}
            fov={70}
          />
          {mycam && (
            <CameraControls ref={setCameraControls} camera={mycam} />
          )}

          <directionalLight color="white" position={[0, 0, 5]} />
          <group ref={setJointMeshRef}>
            <CardMesh cardProps={card} nfcChipProps={nfcChip} />

            <Suspense fallback={null}>
              {textBlock.enabled && textBlock.content.length > 0 && (
                <TextBlockMesh textBlockProps={textBlock} cardProps={card} />
              )}
            </Suspense>

            <Suspense fallback={null}>
              {qrCode.enabled && qrCode.qrContent.length > 0 && (
                <QRCodeMesh qrCodeProps={qrCode} cardProps={card} />
              )}
            </Suspense>
          </group>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default RTFContainer;
