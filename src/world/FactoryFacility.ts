import * as THREE from 'three';
import { WasmLoader } from '../core/WasmLoader';

export class FactoryFacility {
    public mesh: THREE.Group;
    private wasmSim: any = null; // C++ instance

    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        this.mesh = this.generateMesh();
        this.mesh.position.copy(position);
        scene.add(this.mesh);

        this.initSimulation();
    }

    private async initSimulation() {
        try {
            const wasmModule = await WasmLoader.getModule();
            // Instantiate the C++ class mapped via Embind: IndustrialSimulation(initialFactories, efficiency)
            this.wasmSim = new wasmModule.IndustrialSimulation(1000, 0.85);
            this.updateScannerData();
        } catch (e) {
            console.error("Failed to load Wasm simulation", e);
        }
    }

    private generateMesh(): THREE.Group {
        const group = new THREE.Group();

        // Main Hall
        const hallGeo = new THREE.BoxGeometry(40, 15, 60);
        // Move pivot to bottom
        hallGeo.translate(0, 7.5, 0);
        const hallMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.7, metalness: 0.5 });
        const hall = new THREE.Mesh(hallGeo, hallMat);
        hall.castShadow = true;
        hall.receiveShadow = true;
        group.add(hall);

        // Smokestacks
        for(let i=0; i<3; i++) {
            const stackGeo = new THREE.CylinderGeometry(2, 2.5, 30);
            stackGeo.translate(0, 15, 0);
            const stackMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const stack = new THREE.Mesh(stackGeo, stackMat);
            stack.position.set(-15 + (i * 15), 15, -20);
            stack.castShadow = true;
            group.add(stack);
            stack.userData = { isChild: true }; // for raycast routing
        }

        group.userData = { inspectable: true, data: { "Status": "Loading Wasm Sim..." } };
        hall.userData = group.userData;

        return group;
    }

    public updateScannerData(): void {
        if (!this.wasmSim) return;

        this.mesh.userData.data = {
            "Facility": "Macro-Industrial Complex",
            "Nodes": this.wasmSim.getFactoryCount().toString(),
            "Total Demand": `${(this.wasmSim.getEnergyDemandKW() / 1000).toFixed(2)} MW`,
            "Material Output": `${(this.wasmSim.getMaterialThroughputKg() / 1000).toFixed(2)} Tonnes/sec`,
            "Waste Heat": `${(this.wasmSim.getWasteHeatKW() / 1000).toFixed(2)} MW`,
            "Engine": "C++ WebAssembly (High-Perf)"
        };
    }

    public update(dt: number, totalTime: number): void {
        if (!this.wasmSim) return;

        // Multiply production by some sine wave to simulate economic cycles
        const multiplier = 1.0 + Math.sin(totalTime * 0.1) * 0.2;

        // Call into C++ via Wasm
        this.wasmSim.simulateTick(dt, multiplier);

        // Optional: auto expand if time progresses
        if (Math.random() < 0.001) {
            this.wasmSim.expandInfrastructure(10);
        }

        // Periodically sync back to scanner data so UI can read it
        if (Math.floor(totalTime * 10) % 5 === 0) { // Every half second approx
            this.updateScannerData();
        }
    }
}
