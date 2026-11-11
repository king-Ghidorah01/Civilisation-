import * as THREE from 'three';

export class Lighting {
    public directionalLight: THREE.DirectionalLight;
    public ambientLight: THREE.AmbientLight;

    constructor(scene: THREE.Scene) {
        this.ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft white light
        scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
        this.directionalLight.position.set(100, 200, 50);
        this.directionalLight.castShadow = true;

        // Configure shadow properties
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -50;
        this.directionalLight.shadow.camera.right = 50;
        this.directionalLight.shadow.camera.top = 50;
        this.directionalLight.shadow.camera.bottom = -50;
        this.directionalLight.shadow.bias = -0.0001;

        scene.add(this.directionalLight);
    }

    // Future expansion for Day/Night cycle updating
    public update(_time: number): void {
        // e.g. move the sun based on time
    }
}
