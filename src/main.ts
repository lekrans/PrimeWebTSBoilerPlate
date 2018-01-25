import * as THREE from 'three';
import * as TWEEN from 'tween.js'

import * as GEOMETRY from './geometry';
import * as LIGHTS from './lights';

import OrbitControlsfunc from 'three-orbit-controls';
import { DirectionalLight, Clock, PerspectiveCamera, OrthographicCamera } from 'three';
const OrbitControl = OrbitControlsfunc(THREE);


const gui = new dat.GUI();

function init() {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
 // BOX
  const boxGrid = GEOMETRY.getBoxGrid(20, 0.75);
  boxGrid.name = 'boxGrid';
 // PLANE
  const plane = GEOMETRY.getPlane(20);
  plane.name = 'plane-1';  // naming of objects
  plane.rotation.x = Math.PI/2; // 90 degrees in radiants


 // LIGHT
  const pointLight = LIGHTS.getPointLight(1);
  pointLight.position.y = 2; // move the light away from (0,0)
  pointLight.name = 'pointLight1';
  pointLight.intensity = 3;

  const spotLight = LIGHTS.getSpotLight(1);
  spotLight.position.y = 2; // move the light away from (0,0)
  spotLight.name = 'spotlight2';
  spotLight.intensity = 3;

  const directionalLight = LIGHTS.getDirectionalLight(1);
  directionalLight.position.y = 2; // move the light away from (0,0)
  directionalLight.name = 'spotlights';
 // const sphereDirectional = GEOMETRY.getSphere(0.15);
 const camera = new THREE.PerspectiveCamera(
   45,
   window.innerWidth/window.innerHeight,
   1,
   1000
 );

  scene.add(boxGrid);
  scene.add(spotLight);
  scene.add(directionalLight);
  scene.add(pointLight);
  scene.add(plane);

 // CAMERA

 // *****  Normal positioning of the camera .. we disable it because we are setting up an animation rig instead
//  perspectiveCamera.position.x = 1;
//  perspectiveCamera.position.y = 2;
//  perspectiveCamera.position.z = 5;
//  perspectiveCamera.lookAt(new THREE.Vector3(0,0,0));


//  const orthoCamera = new THREE.OrthographicCamera(-15, 15, 15, -15,1, 1000);


// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// ANIMATION RIG...
// note how the groups are nested
//  cameraYRotation(group)
//     [_cameraXRotation(group)
//        [_cameraZPosition(group) .. not that this group is POSITION
//
// this will DISABLE the orbitController

  const cameraZRotation = new THREE.Group();
  const cameraZPosition = new THREE.Group();
  const cameraYPosition = new THREE.Group();
  const cameraXRotation = new THREE.Group();
  const cameraYRotation = new THREE.Group();

  cameraZRotation.name = 'cameraZRotation';
  cameraZPosition.name = 'cameraZPosition';
  cameraYPosition.name = 'cameraYPosition';
  cameraXRotation.name = 'cameraXRotation';
  cameraYRotation.name = 'cameraYRotation';

  cameraZRotation.add(camera);
  cameraYPosition.add(cameraZRotation);
  cameraZPosition.add(cameraYPosition);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);

  scene.add(cameraYRotation);

  cameraZPosition.position.z = 100;
  cameraZPosition.position.y = 1;

  new TWEEN.Tween({ val: 100 })
    .to({ val: -50 }, 12000)
    .onUpdate(function(){
      cameraZPosition.position.z = this.val;
    })
    .start();
  gui.add(cameraZPosition.position, 'z', 0, 100);
  gui.add(cameraYPosition.position, 'y', 0, 100);
  gui.add(cameraZRotation.rotation, 'z', -Math.PI, Math.PI);
  gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
  gui.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-



  // Renderer
 const renderer = new THREE.WebGLRenderer();
 renderer.shadowMap.enabled = true;
 renderer.setSize(window.innerWidth, window.innerHeight);
 document.getElementById('webgl').appendChild(renderer.domElement);

 let controls = new OrbitControl(camera, renderer.domElement);
  controls.enabled = true;

  let cameraPos = {
    origPosition: {
      x: 0,
      y: 0,
      z: 0
    },
    orbitPosition: {
      x: 0,
      y: 0,
      z: 0,
    }
  }
  gui.remember(controls);
  let guiControl = gui.add(controls, 'enabled');
  guiControl.onChange((value: boolean) => {
    if (value === true) {
      camera.lookAt(new THREE.Vector3(cameraPos.origPosition.x,cameraPos.origPosition.y, cameraPos.origPosition.z));
    } else {
      cameraPos.orbitPosition.x = camera.position.x;
      cameraPos.orbitPosition.y = camera.position.y;
      cameraPos.orbitPosition.z = camera.position.z;
      camera.lookAt(new THREE.Vector3(cameraPos.origPosition.x,cameraPos.origPosition.y, cameraPos.origPosition.z));
    }
  })
  gui.remember(pointLight);
  gui.remember(pointLight.position);
  gui.remember(pointLight.visible);
  const pointLightFolder = gui.addFolder('PointLight');
  pointLightFolder.add(pointLight, 'intensity', 0, 10);
  pointLightFolder.add(pointLight.position, 'y', 0,5);
  pointLightFolder.add(pointLight.position, 'x', 0,5);
  pointLightFolder.add(pointLight.position, 'z', 0,5);
  pointLightFolder.add(pointLight, 'visible');

  gui.remember(spotLight);
  gui.remember(spotLight.position);
  gui.remember(spotLight.shadow);
  gui.remember(spotLight.shadow.mapSize);
  const spotLightFolder = gui.addFolder('SpotLight');
  spotLightFolder.add(spotLight, 'intensity', 0, 5);
  spotLightFolder.add(spotLight.position, 'x', 0, 10);
  spotLightFolder.add(spotLight.position, 'y', 0, 5);
  spotLightFolder.add(spotLight.position, 'z', 0, 5);
  spotLightFolder.add(spotLight, 'penumbra', 0, 5);
  spotLightFolder.add(spotLight.shadow, 'bias', 0.001, 0.1); // removes the artifact around the edges on the boxes
  spotLightFolder.add(spotLight.shadow.mapSize, 'width', 0, 40096, 1024); // removes the artifact around the edges on the boxes
  spotLightFolder.add(spotLight.shadow.mapSize, 'height', 0, 40096, 1024); // removes the artifact around the edges on the boxes
  spotLightFolder.add(spotLight, 'visible', 0, 5);

  gui.remember(directionalLight);
  gui.remember(directionalLight.position);
  gui.remember(directionalLight.shadow.camera);

  const directionalLightFolder = gui.addFolder('DirectionalLight');
  directionalLightFolder.add(directionalLight, 'intensity', 0, 5);
  directionalLightFolder.add(directionalLight.position, 'x', 0, 5);
  directionalLightFolder.add(directionalLight.position, 'y', 0, 5);
  directionalLightFolder.add(directionalLight.position, 'z', 0, 5);
  directionalLightFolder.add(directionalLight.shadow.camera, 'top', 5, 20);
  directionalLightFolder.add(directionalLight.shadow.camera, 'bottom', -20, -5).name('cam bottom');
  directionalLightFolder.add(directionalLight.shadow.camera, 'right', 5, 20).name('cam right');
  directionalLightFolder.add(directionalLight.shadow.camera, 'left', -20, -5).name('cam left');
  directionalLightFolder.add(directionalLight, 'visible', 0, 5);
  update(renderer, scene, camera, clock);
}

function update(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock) {
 renderer.render(
   scene,
   camera
 );

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// BOX ANIMATIONS
// Animate the boxes y value by applying Math.sin on a timeValue and offset it by the childs index
//   to make them offseted to each other
// clock: THREE.Clock()
// ANIM_SPEED: constant to change the speed of the box height animation

  let timeElapsed = clock.getElapsedTime();
  const ANIM_SPEED = 4;
  scene.getObjectByName('boxGrid').children.forEach((child, index) => {
    child.scale.y = ((Math.sin(timeElapsed * ANIM_SPEED + index) + 1) / 2) + 0.001;
    child.position.y = child.scale.y / 2;
  })

  TWEEN.update();
    //*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    // Another way to TRAVERSE
    //        scene.traverse((child) => {  // method that applies a function on an object AND it's children
    //          child.scale.x += 0.001;
    //         })
    //*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


    //*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    // WIGGLE EFFECT
    //   Created by the use of the noicejs effect (github.com/josephg/noicejs)
    //   Here it is located in the dist folder and referenced by the index.html
    //   we use the simplex2 algorithm that takes two continous values (like our timeElapsed variable);
  const cameraZ = scene.getObjectByName('cameraZPosition');
 // cameraZ.position.z -= 0.25;

  const WIGGLE_SPEED = 1.5;
  const WIGGLE_AMOUNT = 0.02;
  const cameraZRot = scene.getObjectByName('cameraZRotation');

  cameraZRot.rotation.z = noise.simplex2(timeElapsed * WIGGLE_SPEED, timeElapsed * WIGGLE_SPEED) * WIGGLE_AMOUNT;

  //*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


 requestAnimationFrame(()=>{  // method on the window object that will continously (about 60 times a sec) update the frame/scene
   update(renderer, scene, camera, clock);
 })
}

init();