import { create } from "zustand";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import JSZip from "jszip";
import { toast } from "react-toastify";
import useFormStateStore from "@/store/formStateStore";
import { ErrorAlert } from "@/components/Alert";

const isVisibleInHierarchy = (object: THREE.Object3D) => {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) {
    if (!node.visible) return false;
  }
  return true;
};

// STLExporter ignores `visible`, so it would also export the hidden operand
// brushes that @react-three/csg keeps as children of the result mesh (the
// uncut card and the cutter). Copy only the visible meshes into a fresh group.
function collectVisibleMeshes(root: THREE.Object3D) {
  root.updateWorldMatrix(true, true);

  const group = new THREE.Group();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !isVisibleInHierarchy(object)) {
      return;
    }

    const copy = new THREE.Mesh(object.geometry, object.material);
    copy.applyMatrix4(object.matrixWorld);
    group.add(copy);
  });
  group.updateMatrixWorld(true);

  return group;
}

function convertMeshToStlBlob(mesh: THREE.Object3D) {
  const exporter = new STLExporter();
  const data = exporter.parse(collectVisibleMeshes(mesh), { binary: true });
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
  const blob = convertMeshToStlBlob(mesh);

  downloadBlobAsFile(blob, filename);
}

interface geometryStoreState {
  cardMesh: THREE.Mesh | null;
  textMesh: THREE.Mesh | null;
  qrMesh: THREE.Mesh | null;

  jointMesh: THREE.Mesh | null;

  downloadModel: (errorMessage: string) => void;
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

  downloadModel: (errorMessage) => {
    const { jointMesh: jointModel } = get();
    if (!jointModel) {
      toast(<ErrorAlert message={errorMessage} />);
      return;
    }

    downloadMeshAsStl({ mesh: jointModel, filename: "joint-model.stl" });
  },

  downloadSeparateModels: () => {
    const { cardMesh, qrMesh, textMesh } = get();
    const { qrCode, textBlock } = useFormStateStore.getState().form;
    const zip = new JSZip();

    // TODO: Disable downloading this and the text mesh when they're disabled.
    // Probably need to move the state to zustand for that.
    if (qrMesh && qrCode.enabled) {
      const qrBlob = convertMeshToStlBlob(qrMesh);
      zip.file("qrcode.stl", qrBlob);
    }

    if (textMesh && textBlock.enabled) {
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
