import { useEffect, useMemo, useRef, useState } from "react";
import { QrCodeState } from "../cardFormTypes";
import * as THREE from "three";
import QRCode from "qrcode";
import useMeshStore from "@/store/meshStore";
import { roundedRectShape } from "./CardMesh";

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
        // Shift the grid so the QR code is centered on the origin, where the
        // border ring is also centered.
        shapes.push(
          makeModuleSquare(
            xCoord - size / 2,
            yCoord + 1 - size / 2,
            qrCodeProps.moduleSize,
          ),
        );
      }
    });

    const { border, moduleSize, thickness } = qrCodeProps;
    const qrSize = size * moduleSize;

    if (border.enabled && border.borderThickness > 0) {
      const innerSide = qrSize + border.offset * 2;
      const outerSide = innerSide + border.borderThickness * 2;
      const ring = roundedRectShape(outerSide, outerSide, border.borderRadius);
      ring.holes.push(
        roundedRectShape(
          innerSide,
          innerSide,
          Math.max(border.borderRadius - border.borderThickness, 0),
        ),
      );
      shapes.push(ring);
    }

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: thickness,
      bevelEnabled: false,
      curveSegments: 24,
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
