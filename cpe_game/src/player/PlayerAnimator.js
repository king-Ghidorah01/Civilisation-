import * as THREE from 'three';

export class PlayerAnimator {
    constructor(scene) {
        this.group = new THREE.Group();
        this.scene = scene;
        
        this.walkCycle = 0;
        this.isMoving = false;
        
        this.buildHumanoid();
    }

    buildHumanoid() {
        // Materials for clothing and features
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.6 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x336699, roughness: 0.8 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 });
        const featureMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });
        
        // Torso (Shirt) - Thicker
        this.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), shirtMat);
        this.torso.position.y = 0.8; // FIXED FLOATING (was 1.0)
        this.torso.castShadow = true;
        
        // Head (Skin) - Larger
        this.head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
        this.head.position.y = 0.45;
        
        // Hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
        hair.position.y = 0.02;
        this.head.add(hair);

        // Face - Eyes
        const eyeGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const leftEye = new THREE.Mesh(eyeGeo, featureMat);
        leftEye.position.set(-0.06, 0.02, 0.17);
        this.head.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeo, featureMat);
        rightEye.position.set(0.06, 0.02, 0.17);
        this.head.add(rightEye);

        // Face - Mouth (Neutral/Smile)
        const mouthGeo = new THREE.CapsuleGeometry(0.01, 0.06, 4, 8);
        this.mouth = new THREE.Mesh(mouthGeo, featureMat);
        this.mouth.rotation.z = Math.PI / 2; // Horizontal
        this.mouth.position.set(0, -0.06, 0.175);
        this.head.add(this.mouth);

        this.torso.add(this.head);
        
        // Arms (Skin) - Pivots at shoulder
        this.leftArm = new THREE.Group();
        this.leftArm.position.set(-0.22, 0.25, 0); 
        const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), skinMat);
        lArmMesh.position.y = -0.225; 
        lArmMesh.castShadow = true;
        this.leftArm.add(lArmMesh);
        
        const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), shirtMat); // Sleeve shoulder
        this.leftArm.add(lShoulder);
        this.torso.add(this.leftArm);
        
        this.rightArm = new THREE.Group();
        this.rightArm.position.set(0.22, 0.25, 0);
        const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), skinMat);
        rArmMesh.position.y = -0.225;
        rArmMesh.castShadow = true;
        this.rightArm.add(rArmMesh);
        
        const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), shirtMat); // Sleeve shoulder
        this.rightArm.add(rShoulder);
        this.torso.add(this.rightArm);
        
        // Legs (Pants) - Pivots at hips
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

    update(dt, speed, isMoving, rotationY) {
        this.isMoving = isMoving;
        
        // Sync rotation
        this.group.rotation.y = rotationY;

        if (this.isMoving) {
            // Procedural walk cycle based on speed
            const freq = speed * 1.5;
            this.walkCycle += dt * freq;
            
            // Swing arms (opposite to legs)
            const armSwing = Math.sin(this.walkCycle) * 0.8;
            this.leftArm.rotation.x = armSwing;
            this.rightArm.rotation.x = -armSwing;
            
            // Swing legs
            const legSwing = Math.sin(this.walkCycle) * 0.8;
            this.leftLeg.rotation.x = -legSwing;
            this.rightLeg.rotation.x = legSwing;
            
            // Torso bob (bounce up and down slightly)
            this.torso.position.y = 0.8 + Math.abs(Math.cos(this.walkCycle)) * 0.05;
            
            // Torso lean forward based on speed
            const targetLean = speed > 5 ? 0.2 : 0.05;
            this.torso.rotation.x += (targetLean - this.torso.rotation.x) * dt * 5;

        } else {
            // Idle breathing / return to neutral
            this.walkCycle = 0;
            
            this.leftArm.rotation.x += (0 - this.leftArm.rotation.x) * dt * 5;
            this.rightArm.rotation.x += (0 - this.rightArm.rotation.x) * dt * 5;
            this.leftLeg.rotation.x += (0 - this.leftLeg.rotation.x) * dt * 5;
            this.rightLeg.rotation.x += (0 - this.rightLeg.rotation.x) * dt * 5;
            
            this.torso.rotation.x += (0 - this.torso.rotation.x) * dt * 5;
            
            // Subtle idle breathing bob
            const breath = Math.sin(performance.now() * 0.002) * 0.02;
            this.torso.position.y += ((0.8 + breath) - this.torso.position.y) * dt * 2;
        }
    }
}
