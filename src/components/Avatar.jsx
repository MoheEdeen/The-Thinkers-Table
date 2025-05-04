import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Avatar({ meshPath }) {
    const gltf = useLoader(GLTFLoader, meshPath);
    return <primitive object={gltf.scene} position={[0, -10, 0]} />;
}