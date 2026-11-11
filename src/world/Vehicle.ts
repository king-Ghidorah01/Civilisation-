import * as THREE from 'three';
import { EnergyPhysics } from '../physics/EnergyPhysics';

export class Vehicle {
    public mesh: THREE.Group;
    public mass_kg: number;
    public speed_m_s: number;
    public efficiency: number;

    // Simple movement for demo
    private direction: THREE.Vector3;
    private maxDistance: number = 200;
    private startPosition: THREE.Vector3;

    constructor(scene: THREE.Scene, position: THREE.Vector3, direction: THREE.Vector3) {
        this.mass_kg = 1500; // 1.5 tonnes (typical car)
        this.speed_m_s = 15; // ~54 km/h
        this.efficiency = 0.25; // 25% ICE efficiency
        this.direction = direction.normalize();
        this.startPosition = position.clone();

        this.mesh = this.generateMesh();
        this.mesh.position.copy(position);

        // Face the direction of travel
        this.mesh.lookAt(position.clone().add(this.direction));

        this.updateScannerData();

        scene.add(this.mesh);
    }

    private generateMesh(): THREE.Group {
        const group = new THREE.Group();

        // Car Body
        const bodyGeo = new THREE.BoxGeometry(2, 0.8, 4);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.2, metalness: 0.8 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // Car Top (Cabin)
        const topGeo = new THREE.BoxGeometry(1.8, 0.6, 2);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.set(0, 1.3, -0.2);
        group.add(top);

        // Ensure the entire group is inspectable
        group.userData = { inspectable: true, data: {} };
        body.userData = group.userData;
        top.userData = group.userData;

        return group;
    }

    private updateScannerData(): void {
        const ke = EnergyPhysics.kineticEnergy(this.mass_kg, this.speed_m_s);
        const enginePower = (ke / this.efficiency) / 10; // rough demo calc for power usage

        this.mesh.userData.data = {
            "Type": "Automobile (ICE)",
            "Mass": `${this.mass_kg} kg`,
            "Velocity": `${(this.speed_m_s * 3.6).toFixed(1)} km/h`,
            "Kinetic Energy": `${(ke / 1000).toFixed(1)} kJ`,
            "Est. Power": `${(enginePower / 1000).toFixed(1)} kW`,
            "Efficiency": `${this.efficiency * 100}%`
        };
    }

    public update(dt: number): void {
        const movement = this.direction.clone().multiplyScalar(this.speed_m_s * dt);
        this.mesh.position.add(movement);

        // Reset if it goes too far
        if (this.mesh.position.distanceTo(this.startPosition) > this.maxDistance) {
            this.mesh.position.copy(this.startPosition);
        }
    }
}
