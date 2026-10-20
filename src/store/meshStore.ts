import { create } from "zustand";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/Addons.js";
import JSZip from "jszip";

function convertMeshToStlBlob(mesh: THREE.Mesh) {
  const exporter = new STLExporter();
  const data = exporter.parse(mesh, { binary: true });
  return new Blob([data], { type: "model/stl" });
}

function downloadBlobAsFile(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(blobUrl);
}

function downloadMeshAsStl({
  mesh,
  filename,
}: {
  mesh: THREE.Mesh;
  filename: string;
}) {
  // TODO: show notification about current model being prepared for download
  const blob = convertMeshToStlBlob(mesh);

  downloadBlobAsFile(blob, filename);
}

interface geometryStoreState {
  cardMesh: THREE.Mesh | null;
  textMesh: THREE.Mesh | null;
  qrMesh: THREE.Mesh | null;

  jointMesh: THREE.Mesh | null;

  downloadModel: () => void;
  downloadSeparateModels: () => void;

  setCardMesh: (cardMesh: THREE.Mesh | null) => void;
  setTextMesh: (textMesh: THREE.Mesh | null) => void;
  setQrMesh: (qrMesh: THREE.Mesh | null) => void;
  setJointMesh: (jointModel: THREE.Mesh | null) => void;
}

const useMeshStore = create<geometryStoreState>()((set, get) => ({
  cardMesh: null,
  textMesh: null,
  qrMesh: null,

  jointMesh: null,

  setCardMesh: (cardMesh) => set(() => ({ cardMesh: cardMesh })),
  setTextMesh: (textMesh) => set(() => ({ textMesh: textMesh })),
  setQrMesh: (qrMesh) => set(() => ({ qrMesh: qrMesh })),
  setJointMesh: (jointModel) => set(() => ({ jointMesh: jointModel })),

  downloadModel: () => {
    const { jointMesh: jointModel } = get();
    if (!jointModel) {
      // TODO: show warning notification
      console.log("No joint Model found");
      return;
    }

    downloadMeshAsStl({ mesh: jointModel, filename: "joint-model.stl" });
  },

  downloadSeparateModels: () => {
    const { cardMesh, qrMesh, textMesh } = get();
    const zip = new JSZip();

    // TODO: Disable downloading this and the text mesh when they're disabled.
    // Probably need to move the state to zustand for that.
    if (qrMesh) {
      const qrBlob = convertMeshToStlBlob(qrMesh);
      zip.file("qrcode.stl", qrBlob);
    }

    if (textMesh) {
      const textBlob = convertMeshToStlBlob(textMesh);
      zip.file("text.stl", textBlob);
    }

    if (cardMesh) {
      const cardBlob = convertMeshToStlBlob(cardMesh);
      zip.file("card.stl", cardBlob);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      downloadBlobAsFile(content, "split_models.zip");
    });
  },
}));

export default useMeshStore;
