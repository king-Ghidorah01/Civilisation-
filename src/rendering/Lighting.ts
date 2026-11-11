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

    public update(totalTime: number): void {
        // Simple day/night cycle. Let's say 1 full day = 60 real seconds.
        const dayDuration = 60.0;
        const timeOfDay = (totalTime % dayDuration) / dayDuration; // 0 to 1

        // 0 = noon, 0.25 = dusk, 0.5 = midnight, 0.75 = dawn
        const angle = timeOfDay * Math.PI * 2;

        const sunDistance = 300;
        this.directionalLight.position.x = Math.sin(angle) * sunDistance;
        this.directionalLight.position.y = Math.cos(angle) * sunDistance;
        this.directionalLight.position.z = 50;

        // Intensity mapping
        if (this.directionalLight.position.y > 0) {
            // Daytime
            this.directionalLight.intensity = Math.max(0, this.directionalLight.position.y / sunDistance) * 2.5;
            this.ambientLight.intensity = 1.5;
        } else {
            // Nighttime
            this.directionalLight.intensity = 0;
            this.ambientLight.intensity = 0.2; // very dark
        }
    }
}
