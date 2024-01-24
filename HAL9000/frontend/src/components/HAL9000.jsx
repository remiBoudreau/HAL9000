import React, { useRef, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { useAppContext } from '../ctx/AppContext';

const GLTFViewer = () => {
    const { audioData, setAudioData } = useAppContext();
    const gltfRef = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load(
      // Replace 'path/to/your/model.gltf' with the actual path to your GLTF model
      'path/to/your/model.gltf',
      (gltf) => {
        gltf.scene.scale.set(1, 1, 1); // Adjust the scale as needed
        gltfRef.current.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model', error);
      }
    );
  }, []);

  return (
    <mesh ref={gltfRef} />
  );
};

const App = () => {
  return (
    <Canvas>
      <GLTFViewer />
    </Canvas>
  );
};

export default App;
