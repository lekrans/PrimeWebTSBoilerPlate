import * as THREE from 'three';
import * as GEOMETRY from './geometry';
export function getPointLight(intensity) {
    const light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    const sphere = GEOMETRY.getSphere(0.15);
    light.add(sphere);
    return light;
}
export function getSpotLight(intensity) {
    const light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    const sphere = GEOMETRY.getSphere(0.15);
    light.add(sphere);
    return light;
}
export function getDirectionalLight(intensity) {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.camera.top = 10; //adjust the size of the camera so we get all the shadows
    light.shadow.camera.right = 10;
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    const sphere = GEOMETRY.getSphere(0.15);
    light.add(sphere);
    return light;
}
//# sourceMappingURL=lights.js.map