import * as THREE from "/node_modules/three/build/three.module.js"
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model;

init();
animate();

function init() {
    // Create a scene
    scene = new THREE.Scene();

    // Create a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Create a renderer and add it to the DOM
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    
    // Load the glTF model
    let loader = new GLTFLoader();
    loader.load('hal9000.glb', function(gltf) {
        model = gltf.scene;
        model.rotation.y = 0.79; // Rotate the model to face forward
        scene.add(model);

        let light = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(light);
        
        // Adjust camera position based on the model's bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        camera.position.copy(center);
        camera.position.x += size / 2.0; // Adjust as needed
        camera.position.y += size / 5.0; // Adjust as needed
        camera.position.z += size / 2.0; // Adjust as needed
        camera.lookAt(center);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}