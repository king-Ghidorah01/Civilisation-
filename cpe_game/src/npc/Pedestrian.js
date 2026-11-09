import * as THREE from 'three';

export class Pedestrian {
    constructor(scene, x, z) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.position.set(x, 0, z);
        
        this.walkCycle = Math.random() * Math.PI * 2;
        this.speed = 1.5 + Math.random() * 1.5;
        this.targetAngle = Math.random() * Math.PI * 2;
        this.group.rotation.y = this.targetAngle;

        this.changeDirectionTimer = Math.random() * 5 + 2;

        this.buildMesh();
    }

    buildMesh() {
        const randColor = () => new THREE.Color().setHSL(Math.random(), 0.5 + Math.random() * 0.5, 0.3 + Math.random() * 0.5);
        
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xddaa88, roughness: 0.6 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: randColor(), roughness: 0.8 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
        const hairMat = new THREE.MeshStandardMaterial({ color: randColor(), roughness: 0.9 });
        const featureMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });
        
        // Torso
        this.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), shirtMat);
        this.torso.position.y = 0.8;
        this.torso.castShadow = true;
        
        // Head
        this.head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
        this.head.position.y = 0.45;
        
        // Hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
        hair.position.y = 0.02;
        this.head.add(hair);

        // Eyes
        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), featureMat);
        leftEye.position.set(-0.06, 0.02, 0.17);
        this.head.add(leftEye);
        
        const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), featureMat);
        rightEye.position.set(0.06, 0.02, 0.17);
        this.head.add(rightEye);

        // Mouth
        const mouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.01, 0.06, 4, 8), featureMat);
        mouth.rotation.z = Math.PI / 2;
        mouth.position.set(0, -0.06, 0.175);
        this.head.add(mouth);

        this.torso.add(this.head);

        // Arms
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.22, 0.25, 0); 
        const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), skinMat);
        lArmMesh.position.y = -0.225; 
        lArmMesh.castShadow = true;
        this.leftArm.add(lArmMesh);
        
        const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), shirtMat);
        this.leftArm.add(lShoulder);
        this.torso.add(this.leftArm);
        
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.22, 0.25, 0);
        const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), skinMat);
        rArmMesh.position.y = -0.225;
        rArmMesh.castShadow = true;
        this.rightArm.add(rArmMesh);
        
        const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), shirtMat);
        this.rightArm.add(rShoulder);
        this.torso.add(this.rightArm);
        
        // Legs
        this.leftLeg = new THREE.Group();
        this.leftLeg.position.set(-0.08, -0.3, 0);
        const lLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), pantsMat);
        lLegMesh.position.y = -0.25;
        lLegMesh.castShadow = true;
        this.leftLeg.add(lLegMesh);
        
        const lHip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), pantsMat);
        this.leftLeg.add(lHip);
        this.torso.add(this.leftLeg);
        
        this.rightLeg = new THREE.Group();
        this.rightLeg.position.set(0.08, -0.3, 0);
        const rLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), pantsMat);
        rLegMesh.position.y = -0.25;
        rLegMesh.castShadow = true;
        this.rightLeg.add(rLegMesh);
        
        const rHip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), pantsMat);
        this.rightLeg.add(rHip);
        this.torso.add(this.rightLeg);
        
        this.group.add(this.torso);
        this.scene.add(this.group);
    }

    update(dt) {
        // AI Logic
        this.changeDirectionTimer -= dt;
        if (this.changeDirectionTimer <= 0) {
            this.targetAngle += (Math.random() - 0.5) * Math.PI; // Random turn
            this.changeDirectionTimer = Math.random() * 5 + 2;
        }

        // Smooth rotation
        const diff = this.targetAngle - this.group.rotation.y;
        const normDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.group.rotation.y += normDiff * dt * 2;

        // Move forward
        const moveDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0,1,0), this.group.rotation.y);
        this.group.position.addScaledVector(moveDir, this.speed * dt);

        // Keep within city bounds (rough bounce)
        if (Math.abs(this.group.position.x) > 200 || Math.abs(this.group.position.z) > 200) {
            this.targetAngle += Math.PI; // turn around
        }

        // Animate Walking
        const freq = this.speed * 2.0;
        this.walkCycle += dt * freq;
        
        const armSwing = Math.sin(this.walkCycle) * 0.8;
        this.leftArm.rotation.x = armSwing;
        this.rightArm.rotation.x = -armSwing;
        
        const legSwing = Math.sin(this.walkCycle) * 0.8;
        this.leftLeg.rotation.x = -legSwing;
        this.rightLeg.rotation.x = legSwing;
        
        this.torso.position.y = 0.8 + Math.abs(Math.cos(this.walkCycle)) * 0.05;
        this.torso.rotation.x = 0.05; // Slight lean
    }
}
