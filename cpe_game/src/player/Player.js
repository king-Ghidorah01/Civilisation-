import * as THREE from 'three';
import { PlayerCamera } from './PlayerCamera.js';
import { PlayerController } from './PlayerController.js';
import { PlayerAnimator } from './PlayerAnimator.js';

export class Player {
    constructor(scene, input, worldManager) {
        this.scene = scene;
        this.input = input;
        this.worldManager = worldManager;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotationY = 0;
        
        this.animator = new PlayerAnimator(scene);
        
        this.camera = new PlayerCamera();
        this.controller = new PlayerController(this, input, this.camera, worldManager);
    }

    update(dt) {
        this.controller.update(dt);
        
        // Sync animator logical position
        this.animator.group.position.copy(this.position);
        
        // Let controller tell us if moving and how fast
        const isMoving = this.controller.isMoving;
        const speed = this.controller.currentSpeed;
        
        this.animator.update(dt, speed, isMoving, this.rotationY);
        
        this.camera.update(this.position, this.input);
    }
}
