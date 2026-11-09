import * as THREE from 'three';

export class PlayerController {
    constructor(player, input, camera, worldManager) {
        this.player = player;
        this.input = input;
        this.camera = camera;
        this.worldManager = worldManager;
        
        this.speed = 4.0; // Walk speed
        this.runMultiplier = 2.0;
        this.velocity = new THREE.Vector3();
        
        this.isMoving = false;
        this.currentSpeed = 0;
    }

    update(dt) {
        if (!this.input.mouse.locked) {
            this.isMoving = false;
            return;
        }

        const moveDir = new THREE.Vector3();
        
        if (this.input.isPressed('KeyW')) moveDir.z -= 1;
        if (this.input.isPressed('KeyS')) moveDir.z += 1;
        if (this.input.isPressed('KeyA')) moveDir.x -= 1;
        if (this.input.isPressed('KeyD')) moveDir.x += 1;

        moveDir.normalize();
        
        this.isMoving = moveDir.lengthSq() > 0.01;

        // Rotate movement direction to match camera yaw
        const camYaw = new THREE.Euler(0, this.camera.yaw, 0, 'YXZ');
        moveDir.applyEuler(camYaw);

        this.currentSpeed = this.input.isPressed('ShiftLeft') ? this.speed * this.runMultiplier : this.speed;

        // Gravity and Jumping
        if (this.player.position.y > 0) {
            this.velocity.y -= 20.0 * dt; // Gravity
        } else {
            this.velocity.y = 0;
            this.player.position.y = 0;
            if (this.input.isPressed('Space')) {
                this.velocity.y = 8.0; // Jump force
            }
        }
        this.player.position.y += this.velocity.y * dt;

        // Apply horizontal movement
        if (this.isMoving) {
            const nextX = this.player.position.x + moveDir.x * this.currentSpeed * dt;
            const nextZ = this.player.position.z + moveDir.z * this.currentSpeed * dt;
            const radius = 0.5;

            let canMove = true;
            if (this.worldManager && this.worldManager.currentWorld && this.worldManager.currentWorld.checkCollision) {
                if (this.worldManager.currentWorld.checkCollision(nextX, nextZ, radius)) {
                    canMove = false;
                }
            }

            if (canMove) {
                this.player.position.x = nextX;
                this.player.position.z = nextZ;
            } else {
                this.isMoving = false;
            }
            
            const targetAngle = Math.atan2(moveDir.x, moveDir.z);
            const diff = targetAngle - this.player.rotationY;
            const normDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
            this.player.rotationY += normDiff * dt * 10;
        }
    }
}
