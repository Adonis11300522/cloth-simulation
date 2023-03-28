import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
const gui = new dat.GUI();
const debugObject = {};
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
let mixer = null;
const loadModel = (path, name, scale, visible) => {
  gltfLoader.load(
    path,
    (model) => {
      model.scene.scale.set(scale, scale, scale);
      scene.add(model.scene);
      gui
        .add(model.scene.rotation, 'y')
        .min(- Math.PI)
        .max(Math.PI)
        .step(0.001)
        .name(name);
      model.scene.visible = visible;
      var controls = {
        On: function () {
          model.scene.traverse(function (child) { child.visible = true; });
        },
        Off: function () {
          model.scene.traverse(function (child) { child.visible = false; });
        }
      };
      gui.add(controls, 'On');
      gui.add(controls, 'Off');
    }
  )
}
loadModel('/models/Henri/Henri.gltf', 'Henri', 0.001, true);
loadModel('/models/Henri/Tshirt.gltf', 'tshirt', 0.001, true);
loadModel('/models/Henri/Pant.gltf', 'Pant', 0.001, true);
loadModel('/models/Henri/Debardeur.gltf', 'Debardeur', 0.001, true);
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
  })
)
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = - 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = - 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.background = new THREE.Color(111333);
camera.position.set(2, 2, 2);
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  if (mixer) {
    mixer.update(deltaTime);
  }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();