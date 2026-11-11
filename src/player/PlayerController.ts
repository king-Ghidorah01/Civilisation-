import * as THREE from 'three';
import { InputSystem } from '../core/InputSystem';
import { EventBus } from '../core/EventBus';

export class PlayerController {
    public mesh: THREE.Mesh;
    private camera: THREE.PerspectiveCamera;
    private input: InputSystem;
    private eventBus: EventBus;

    // Physics / Movement state
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private direction: THREE.Vector3 = new THREE.Vector3();

    private speed: number = 5.0; // m/s
    private runSpeed: number = 10.0;
    private gravity: number = 9.81;
    private jumpVelocity: number = 5.0;

    private canJump: boolean = true;

    // Raycaster for science scanner
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private centerScreen: THREE.Vector2 = new THREE.Vector2(0, 0);
    private interactableObjects: THREE.Object3D[] = [];

    // Camera settings
    private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');
    private PI_2 = Math.PI / 2;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, input: InputSystem, eventBus: EventBus) {
        this.camera = camera;
        this.input = input;
        this.eventBus = eventBus;

        // Create procedurally generated stylized player body (cylinder)
        const geometry = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16);
        geometry.translate(0, 0.9, 0); // Origin at feet
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        // Attach camera for First Person / Hybrid view temporarily for exploration
        // (Will expand to proper 3rd person camera rig later)
        this.camera.position.set(0, 1.6, 0);
        this.mesh.add(this.camera);

        this.eventBus.on('ui:start_clicked', () => {
            this.input.requestPointerLock(document.body);
        });
    }

    public setInteractableObjects(objects: THREE.Object3D[]): void {
        this.interactableObjects = objects;
    }

    public update(deltaTime: number): void {
        if (!this.input.isPointerLocked) return;

        this.updateRotation();
        this.updateMovement(deltaTime);
        this.updateScanner();
    }

    private updateRotation(): void {
        this.euler.setFromQuaternion(this.camera.quaternion);

        // Mouse sensitivity
        const sensitivity = 0.002;
        this.euler.y -= this.input.movementX * sensitivity;
        this.euler.x -= this.input.movementY * sensitivity;

        // Clamp vertical look
        this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x));

        this.camera.quaternion.setFromEuler(this.euler);

        // Match player body Y rotation to camera Y rotation
        this.mesh.rotation.y = this.euler.y;
    }

    private updateMovement(deltaTime: number): void {
        // Damping
        this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
        this.velocity.z -= this.velocity.z * 10.0 * deltaTime;
        this.velocity.y -= this.gravity * deltaTime;

        this.direction.z = Number(this.input.isKeyPressed('KeyW')) - Number(this.input.isKeyPressed('KeyS'));
        this.direction.x = Number(this.input.isKeyPressed('KeyD')) - Number(this.input.isKeyPressed('KeyA'));
        this.direction.normalize();

        const currentSpeed = this.input.isKeyPressed('ShiftLeft') ? this.runSpeed : this.speed;

        if (this.direction.z !== 0 || this.direction.x !== 0) {
            // Calculate movement relative to rotation
            const moveZ = this.direction.z * currentSpeed * deltaTime;
            const moveX = this.direction.x * currentSpeed * deltaTime;

            // Move taking Y rotation into account
            this.mesh.translateX(moveX);
            this.mesh.translateZ(-moveZ);
        }

        // Apply jump & gravity
        this.mesh.position.y += this.velocity.y * deltaTime;

        // Basic floor collision
        if (this.mesh.position.y < 0) {
            this.velocity.y = 0;
            this.mesh.position.y = 0;
            this.canJump = true;
        }

        if (this.input.isKeyPressed('Space') && this.canJump) {
            this.velocity.y = this.jumpVelocity;
            this.canJump = false;
        }
    }

    private updateScanner(): void {
        // Raycast from camera center
        this.raycaster.setFromCamera(this.centerScreen, this.camera);

        // Max inspection distance 50m
        this.raycaster.far = 50;

        const intersects = this.raycaster.intersectObjects(this.interactableObjects, false);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.inspectable) {
                // If pressing 'E', emit inspection event
                if (this.input.isKeyPressed('KeyE')) {
                    this.eventBus.emit('scanner:inspect', object.userData.data);
                }
            }
        } else {
            // Optional: Auto-clear if looking away, but here we require another interaction or time.
            // Leaving it manual for now.
        }

        // Clear via Q key
        if(this.input.isKeyPressed('KeyQ')){
             this.eventBus.emit('scanner:clear');
        }
    }
}
