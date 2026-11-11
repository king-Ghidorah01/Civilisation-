import * as THREE from 'three';

export class Renderer {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

        // Logarithmic depth buffer is critical for multi-scale (from meters to AUs)
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            logarithmicDepthBuffer: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

        // Physically based rendering settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Standard third person perspective camera
        // High far clipping plane due to log depth buffer
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e12);
        this.camera.position.set(0, 2, 5);

        window.addEventListener('resize', this.onResize.bind(this));
    }

    private onResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
