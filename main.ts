import * as THREE from 'three';

function init() {
 const scene = new THREE.Scene();

 // BOX
 const box = getBox(1,1,1);
 box.position.y = box.geometry.parameters.height/2;  // move the box UP half it's size

 // PLANE
 const plane = getPlane(4);
 plane.name = 'plane-1';  // naming of objects
 plane.rotation.x = Math.PI/2; // 90 degrees in radiants
 plane.position.y = 1;

 // LIGHT
 const pointLight = getPointLight(1);
 pointLight.position.y = 2; // move the light away from (0,0)
 pointLight.name = 'pointLight1';
 const sphere = getSphere(0.15);


 // ADD TO SCENE
 plane.add(box);  // add the box to the PLANE
 scene.add(plane);
 scene.add(pointLight)
 pointLight.add(sphere);  // add a sphere to the light to be able to see the lights position

 // initialize the box
 //box.rotation.y = 50; box.rotation.x = 150; box.rotation.z = 50;

 const camera = new THREE.PerspectiveCamera(
   45,
   window.innerWidth/window.innerHeight,
   1,
   1000
 );
 // Camera
 camera.position.x = 1;
 camera.position.y = 2;
 camera.position.z = 5;
 camera.lookAt(new THREE.Vector3(0,0,0));

 // Renderer
 const renderer = new THREE.WebGLRenderer();
 renderer.setSize(window.innerWidth, window.innerHeight);
 document.getElementById('webgl').appendChild(renderer.domElement);

 //
 update(renderer, scene, camera);
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
 return mesh;
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

return mesh;
}

function getPointLight(intensity: number) {
 const light = new THREE.PointLight(0xffffff, intensity);

 return light;
}

function update(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
 renderer.render(
   scene,
   camera
 );

 const pLight = scene.getObjectByName('pointLight1');
 pLight.position.x += 0.01;
 pLight.position.y -= 0.01;
 pLight.position.z += 0.01;
 //const plane = scene.getObjectByName('plane-1');
 //plane.rotation.y += 0.01;
 // plane.rotation.z += 0.01;


 // scene.traverse((child) => {  // method that applies a function on an object AND it's children
 //   child.scale.x += 0.001;
 // })
 requestAnimationFrame(()=>{  // method on the window object that will continously (about 60 times a sec) update the frame/scene
   update(renderer, scene, camera);
 })
}

init();