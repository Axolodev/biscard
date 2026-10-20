import { useEffect, useMemo, useRef, useState } from "react";
import { QrCodeState } from "../cardFormTypes";
import * as THREE from "three";
import QRCode from "qrcode";
import useMeshStore from "@/store/meshStore";

const makeModuleSquare = (col: number, row: number, moduleSize: number) => {
  const x = col * moduleSize;
  const y = -row * moduleSize; // flip y: matrix rows go down, 3D y goes up

  const shape = new THREE.Shape();
  shape.moveTo(x, y);
  shape.lineTo(x + moduleSize, y);
  shape.lineTo(x + moduleSize, y + moduleSize);
  shape.lineTo(x, y + moduleSize);
  shape.closePath();
  return shape;
};

const QRCodeMesh = ({ qrCodeProps }: { qrCodeProps: QrCodeState }) => {
  const [meshRef, setMeshRef] = useState<THREE.Mesh | null>(null);

  const qrCode = useMemo(
    () =>
      QRCode.create(qrCodeProps.qrContent, {
        errorCorrectionLevel: qrCodeProps.errorCorrection,
      }),
    [qrCodeProps.qrContent, qrCodeProps.errorCorrection],
  );

  const geometry = useMemo(() => {
    const { size, data } = qrCode.modules;

    const shapes: THREE.Shape[] = [];
    data.forEach((value, index) => {
      if (value) {
        const yCoord = Math.floor(index / size);
        const xCoord = Math.floor(index % size);
        shapes.push(makeModuleSquare(xCoord, yCoord, qrCodeProps.moduleSize));
      }
    });

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: qrCodeProps.thickness,
      bevelEnabled: false,
    });

    geometry.center();

    return geometry;
  }, [qrCode, qrCodeProps]);

  const { setQrMesh } = useMeshStore();

  useEffect(() => {
    if (!meshRef) return;

    setQrMesh(meshRef);
  }, [meshRef, setQrMesh]);

  return (
    <mesh
      ref={setMeshRef}
      position={[
        qrCodeProps.xPosition,
        qrCodeProps.yPosition,
        qrCodeProps.zPosition,
      ]}
      scale={1}
      geometry={geometry}
    >
      <meshPhongMaterial attach="material" color="black" />
    </mesh>
  );
};

export default QRCodeMesh;
