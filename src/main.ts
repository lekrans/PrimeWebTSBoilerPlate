import * as THREE from 'three';
import OrbitControlsfunc from 'three-orbit-controls';
import { DirectionalLight, Clock, PerspectiveCamera, OrthographicCamera } from 'three';
const OrbitControl = OrbitControlsfunc(THREE);



const gui = new dat.GUI();

function init() {
 const scene = new THREE.Scene();
 const clock = new THREE.Clock();
 // BOX
const boxGrid = getBoxGrid(20, 0.75);
boxGrid.name = 'boxGrid';
 // PLANE
 const plane = getPlane(20);
 plane.name = 'plane-1';  // naming of objects
 plane.rotation.x = Math.PI/2; // 90 degrees in radiants


 // LIGHT
 const pointLight = getPointLight(1);
 pointLight.position.y = 2; // move the light away from (0,0)
 pointLight.name = 'pointLight1';
 const sphere = getSphere(0.15);
 pointLight.intensity = 3;

 const spotLight = getSpotLight(1);
 spotLight.position.y = 2; // move the light away from (0,0)
 spotLight.name = 'spotlight2';
 const sphereSpot = getSphere(0.15);
 spotLight.intensity = 3;

 const directionalLight = getDirectionalLight(1);
 directionalLight.position.y = 2; // move the light away from (0,0)
 directionalLight.name = 'spotlights';
 const sphereDirectional = getSphere(0.15);
 directionalLight.intensity = 3;

 const helper = new THREE.CameraHelper(directionalLight.shadow.camera);

 // ADD TO SCENE
 scene.add(plane);
 scene.add(pointLight)
 scene.add(spotLight)
 scene.add(directionalLight)
 scene.add(boxGrid);
 pointLight.add(sphere);  // add a sphere to the light to be able to see the lights position
 spotLight.add(sphereSpot);  // add a sphere to the light to be able to see the lights position
 scene.add(helper);


 gui.remember(pointLight);
 gui.remember(pointLight.position);
 const pointLightFolder = gui.addFolder('PointLight');
 pointLightFolder.add(pointLight, 'intensity', 0, 10);
 pointLightFolder.add(pointLight.position, 'y', 0,5);
 pointLightFolder.add(pointLight.position, 'x', 0,5);
 pointLightFolder.add(pointLight.position, 'z', 0,5);
 pointLightFolder.add(pointLight, 'visible');
 gui.remember(pointLight.visible);

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



 // initialize the box
 //box.rotation.y = 50; box.rotation.x = 150; box.rotation.z = 50;

 const perspectiveCamera = new THREE.PerspectiveCamera(
   45,
   window.innerWidth/window.innerHeight,
   1,
   1000
 );
 // Camera
 perspectiveCamera.position.x = 1;
 perspectiveCamera.position.y = 2;
 perspectiveCamera.position.z = 5;
 perspectiveCamera.lookAt(new THREE.Vector3(0,0,0));

 const orthoCamera = new THREE.OrthographicCamera(-15,15,15,-15);


let camera: PerspectiveCamera | OrthographicCamera = perspectiveCamera;


  let CameraConfig = function() {
    this.perspective = 'perspective';
  }

  // Renderer
 const renderer = new THREE.WebGLRenderer();
 renderer.shadowMap.enabled = true;
 renderer.setSize(window.innerWidth, window.innerHeight);
 document.getElementById('webgl').appendChild(renderer.domElement);

 let controls = new OrbitControl(camera, renderer.domElement);
 //
 update(renderer, scene, camera, clock);
}

function getBox(w: number, h: number, d: number) {
 const geometry = new THREE.BoxGeometry(w,h,d);
 const material = new THREE.MeshPhongMaterial({
   color: "rgb(120,120,120)"
 });

 const mesh = new THREE.Mesh(
   geometry,
   material
 )
 mesh.castShadow = true;
 return mesh;
}

function getBoxGrid(amount: number, separationMultiplier: number) {
  const group = new THREE.Group();
  const boxSize = separationMultiplier/1.2;
  for (let  i = 0;   i < amount;   i++)   {
    let obj = getBox(boxSize, boxSize, boxSize);

    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height/2;
    group.add(obj);
    for (let j = 1; j < amount; j++) {
      let obj = getBox(boxSize, boxSize, boxSize);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height/2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }

  group.position.x = -(separationMultiplier * (amount -1))/2;
  group.position.z = -(separationMultiplier * (amount -1))/2;

  return group;
}

function getSphere(size: number) {
 const geometry = new THREE.SphereGeometry(size, 24, 24);
 const material = new THREE.MeshBasicMaterial({
   color: "rgb(120,120,120)"
 });

 const mesh = new THREE.Mesh(
   geometry,
   material
 )
 return mesh;
}

function getPlane(size: number ) {
 const geometry = new THREE.PlaneGeometry(size,size);
 const material = new THREE.MeshPhongMaterial({
   color: "rgb(255, 255, 255)",
   side: THREE.DoubleSide
 });
const mesh = new THREE.Mesh(
  geometry,
  material
);

mesh.receiveShadow = true;
return mesh;
}

function getPointLight(intensity: number) {
 const light = new THREE.PointLight(0xffffff, intensity);
 light.castShadow = true;

 return light;
}

function getSpotLight(intensity: number) {
 const light = new THREE.SpotLight(0xffffff, intensity);
 light.castShadow = true;

 return light;
}


function getDirectionalLight(intensity: number) {
 const light = new THREE.DirectionalLight(0xffffff, intensity);
 light.castShadow = true;
 light.shadow.camera.top = 10;  //adjust the size of the camera so we get all the shadows
 light.shadow.camera.right = 10;
 light.shadow.camera.left = -10;
 light.shadow.camera.bottom = -10;
 return light;
}

function update(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock) {
 renderer.render(
   scene,
   camera
 );

 let timeElapsed = clock.getElapsedTime();
 scene.getChildByName('boxGrid').children.forEach((child, index) => {
   child.scale.y = ((Math.sin(timeElapsed * 4 + index) + 1)/2) + 0.001;
   child.position.y = child.scale.y/2;
 })
 //const pLight = scene.getObjectByName('pointLight1');
//  pLight.position.x += 0.01;
//  pLight.position.y -= 0.01;
//  pLight.position.z += 0.01;
 //const plane = scene.getObjectByName('plane-1');
 //plane.rotation.y += 0.01;
 // plane.rotation.z += 0.01;


 // scene.traverse((child) => {  // method that applies a function on an object AND it's children
 //   child.scale.x += 0.001;
 // })
 requestAnimationFrame(()=>{  // method on the window object that will continously (about 60 times a sec) update the frame/scene
   update(renderer, scene, camera, clock);
 })
}

init();