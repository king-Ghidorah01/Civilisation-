import * as THREE from 'three';
import { VehicleManager } from './VehicleManager';
import { NPCManager } from '../npc/NPCManager';
import { FactoryFacility } from './FactoryFacility';

export class EarthWorld {
    public scene: THREE.Scene;
    public interactableObjects: THREE.Object3D[] = [];

    public vehicleManager: VehicleManager;
    public npcManager: NPCManager;
    public factory: FactoryFacility;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.vehicleManager = new VehicleManager(this.scene);
        this.npcManager = new NPCManager(this.scene);
        // Place factory outside the procedural city
        this.factory = new FactoryFacility(this.scene, new THREE.Vector3(-150, 0, -150));
        this.generateEnvironment();
    }

    private generateEnvironment(): void {
        this.createGround();
        this.createCityBlock();

        // Merge interactables
        this.interactableObjects.push(...this.vehicleManager.getInteractables());
        this.interactableObjects.push(...this.npcManager.getInteractables());
        this.interactableObjects.push(this.factory.mesh);
        this.interactableObjects.push(...this.factory.mesh.children);
    }

    public update(dt: number, totalTime: number): void {
        this.vehicleManager.update(dt);
        this.npcManager.update(dt);
        this.factory.update(dt, totalTime);
    }

    private createGround(): void {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        const material = new THREE.MeshStandardMaterial({
            color: 0x334433,
            roughness: 0.8,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2; // Flat on XZ plane
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    private createCityBlock(): void {
        // Procedurally generate some stylized buildings
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x888899,
            roughness: 0.6,
            metalness: 0.3
        });

        const numBuildings = 20;

        for (let i = 0; i < numBuildings; i++) {
            const width = 10 + Math.random() * 20;
            const depth = 10 + Math.random() * 20;
            const height = 20 + Math.random() * 100;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            // shift origin to bottom
            geometry.translate(0, height / 2, 0);

            const building = new THREE.Mesh(geometry, buildingMaterial);

            // Random position away from center (0,0,0)
            const x = (Math.random() - 0.5) * 400;
            const z = (Math.random() - 0.5) * 400;

            // Ensure buildings don't spawn right on top of player at 0,0,0
            if (Math.abs(x) < 30 && Math.abs(z) < 30) {
                building.position.set(x + 50, 0, z + 50);
            } else {
                building.position.set(x, 0, z);
            }

            building.castShadow = true;
            building.receiveShadow = true;

            // --- SCIENCE DATA BINDING ---
            // Calculate procedural scientific data based on dimensions
            const volume_m3 = width * depth * height;
            const estimated_mass_kg = volume_m3 * 300; // rough density guess for building volume
            const energy_demand_kw = (volume_m3 * 0.05).toFixed(1); // 50 watts per cubic meter assumption

            building.userData = {
                inspectable: true,
                data: {
                    "Type": "Commercial Building",
                    "Height": `${height.toFixed(1)} m`,
                    "Est. Mass": `${(estimated_mass_kg / 1000).toFixed(0)} Tonnes`,
                    "Power Demand": `${energy_demand_kw} kW`,
                    "Primary Material": "Steel / Concrete"
                }
            };

            this.scene.add(building);
            this.interactableObjects.push(building);
        }
    }
}
