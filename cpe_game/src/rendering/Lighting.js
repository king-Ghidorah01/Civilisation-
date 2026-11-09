import * as THREE from 'three';

export class Lighting {
    constructor(scene) {
        this.scene = scene;
        this.initLighting();
    }

    initLighting() {
        this.ambient = new THREE.AmbientLight(0x606060, 1.0); 
        this.scene.add(this.ambient);

        this.sun = new THREE.DirectionalLight(0xffeedd, 2.5);
        this.sun.position.set(200, 300, 150);
        this.sun.castShadow = true;
        
        // Shadow configuration for large scale
        this.sun.shadow.camera.left = -200;
        this.sun.shadow.camera.right = 200;
        this.sun.shadow.camera.top = 200;
        this.sun.shadow.camera.bottom = -200;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 1000;
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        
        this.scene.add(this.sun);

        // Visible Sun Mesh
        const sunGeo = new THREE.SphereGeometry(15, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffee });
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);
        // Position it far away along the light vector
        sunMesh.position.copy(this.sun.position).normalize().multiplyScalar(400);
        this.scene.add(sunMesh);

        // Sky and Fog
        this.scene.background = new THREE.Color(0x88ccff);
        this.scene.fog = new THREE.FogExp2(0x88ccff, 0.003);
    }
}
