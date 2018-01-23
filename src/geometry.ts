import * as THREE from 'three';

export function getBox(w: number, h: number, d: number) {
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

export function getBoxGrid(amount: number, separationMultiplier: number) {
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

export function getSphere(size: number) {
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

export function getPlane(size: number ) {
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
