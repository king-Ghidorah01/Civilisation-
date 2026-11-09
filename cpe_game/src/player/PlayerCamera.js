import * as THREE from 'three';

export class PlayerCamera {
    constructor(renderer) {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.pitch = 0; // vertical rotation
        this.yaw = 0; // horizontal rotation
        
        // Third person offset
        this.offset = new THREE.Vector3(0, 2, 5); 
        this.lookOffset = new THREE.Vector3(0, 1.5, 0);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    update(playerPosition, input) {
        if (input.mouse.locked) {
            const { dx, dy } = input.consumeMouseDelta();
            this.yaw -= dx * 0.002;
            this.pitch -= dy * 0.002;
            // Clamp pitch
            this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
        }

        // Calculate orbit position
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
        
        // Local offset rotated by camera quaternion
        const rotatedOffset = this.offset.clone().applyQuaternion(q);
        this.camera.position.copy(playerPosition).add(rotatedOffset);
        
        const lookAtTarget = playerPosition.clone().add(this.lookOffset);
        this.camera.lookAt(lookAtTarget);
    }
}
