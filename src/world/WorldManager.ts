import * as THREE from 'three';
import { EarthWorld } from './EarthWorld';

export class WorldManager {
    public scene: THREE.Scene;
    public currentWorld: EarthWorld | null = null;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public loadEarthStage(): void {
        this.currentWorld = new EarthWorld(this.scene);
    }

    public getInteractables(): THREE.Object3D[] {
        return this.currentWorld ? this.currentWorld.interactableObjects : [];
    }

    public update(dt: number, totalTime: number): void {
        if (this.currentWorld) {
            this.currentWorld.update(dt, totalTime);
        }
    }
}
