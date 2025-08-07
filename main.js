import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
// const cubeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
// });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);

let donut = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './asset/donut/scene.gltf',
  gltf => {
    donut = gltf.scene;
    donut.position.x = 1.5;
    donut.rotation.x = Math.PI * .2;
    donut.rotation.z = Math.PI * .15;

    const radius = .3;
    donut.scale.set(radius, radius, radius);

    scene.add(donut);
  }
);

const transformDonut = [
  {
    rotationZ: Math.PI * .14,
    positionX: 1.5,
  },
  {
    rotationZ: Math.PI * -.14,
    positionX: -1.5,
  },
  {
    rotationZ: Math.PI * .01,
    positionX: 0,
  },
];

const scroll = {
  y: scrollY,
};
let currentSection = 0;
addEventListener('scroll', () => {
  scroll.y = scrollY;
  const newSection = Math.round(scroll.y / sizes.height);
  
  if (newSection != currentSection) {
    currentSection = newSection;

    if (Boolean(donut)) {
      gsap.to(
        donut.rotation,
        {
          duration: 1.5,
          ease: 'power2.inOut',
          z: transformDonut[currentSection].rotationZ,
        },
      );
      gsap.to(
        donut.position,
        {
          duration: 1.5,
          ease: 'power2.inOut',
          x: transformDonut[currentSection].positionX,
        },
      );
    }
  }
});

addEventListener('beforeunload', () => scrollTo(0, 0));

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, .1, 1000);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, .8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2,devicePixelRatio));
renderer.render(scene, camera);

const clock = new THREE.Clock();
let lastElapsedTime = 0;

function tick() {
  requestAnimationFrame(tick);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (Boolean(donut)) {
    donut.position.y = .1 * Math.sin(elapsedTime * .5) - .1;
  }

  // cube.rotation.y = Math.sin(elapsedTime);

  renderer.render(scene, camera);
}

tick();

function main() {}

// main();
