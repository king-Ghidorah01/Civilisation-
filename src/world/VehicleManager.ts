import * as THREE from 'three';
import { Vehicle } from './Vehicle';

export class VehicleManager {
    private scene: THREE.Scene;
    public vehicles: Vehicle[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.spawnTraffic();
    }

    private spawnTraffic(): void {
        // Spawn a few cars driving on simple paths

        // Car 1 going North
        this.vehicles.push(new Vehicle(
            this.scene,
            new THREE.Vector3(5, 0, 100),
            new THREE.Vector3(0, 0, -1)
        ));

        // Car 2 going South
        this.vehicles.push(new Vehicle(
            this.scene,
            new THREE.Vector3(-5, 0, -100),
            new THREE.Vector3(0, 0, 1)
        ));

        // Car 3 going East
        this.vehicles.push(new Vehicle(
            this.scene,
            new THREE.Vector3(-100, 0, 15),
            new THREE.Vector3(1, 0, 0)
        ));
    }

    public getInteractables(): THREE.Object3D[] {
        const interactables: THREE.Object3D[] = [];
        for (const v of this.vehicles) {
            interactables.push(v.mesh);
            // Need to add children so raycaster hits the mesh components
            interactables.push(...v.mesh.children);
        }
        return interactables;
    }

    public update(dt: number): void {
        for (const vehicle of this.vehicles) {
            vehicle.update(dt);
        }
    }
}
