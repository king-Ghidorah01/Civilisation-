import * as THREE from 'three';
import { NPC } from './NPC';

export class NPCManager {
    private scene: THREE.Scene;
    public npcs: NPC[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.spawnCitizens();
    }

    private spawnCitizens(): void {
        this.npcs.push(new NPC(
            this.scene,
            new THREE.Vector3(10, 0, 10),
            "Dr. Aris",
            "Energy Engineer",
            "Thermodynamics & Power Grids",
            0x224488
        ));

        this.npcs.push(new NPC(
            this.scene,
            new THREE.Vector3(-15, 0, 12),
            "Sarah",
            "City Planner",
            "Infrastructure & Logistics",
            0x448844
        ));

        this.npcs.push(new NPC(
            this.scene,
            new THREE.Vector3(5, 0, -20),
            "James",
            "Ordinary Citizen",
            "General Context",
            0x884422
        ));
    }

    public getInteractables(): THREE.Object3D[] {
        const interactables: THREE.Object3D[] = [];
        for (const npc of this.npcs) {
            interactables.push(npc.mesh);
            interactables.push(...npc.mesh.children);
        }
        return interactables;
    }

    public update(_dt: number): void {
        // Future: Handle NPC schedules and pathfinding
    }
}
