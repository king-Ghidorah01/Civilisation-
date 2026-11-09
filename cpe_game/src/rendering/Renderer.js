import * as THREE from 'three';

export class Renderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
        
        // Setup renderer
        this.webgl = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.webgl.setSize(window.innerWidth, window.innerHeight);
        this.webgl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.webgl.shadowMap.enabled = true;
        this.webgl.shadowMap.type = THREE.PCFSoftShadowMap;
        this.webgl.toneMapping = THREE.ACESFilmicToneMapping;
        
        this.container.appendChild(this.webgl.domElement);
        
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.webgl.setSize(window.innerWidth, window.innerHeight);
    }

    render(camera) {
        this.webgl.render(this.scene, camera);
    }
}
