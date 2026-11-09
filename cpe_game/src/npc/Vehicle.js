import * as THREE from 'three';

export class Vehicle {
    constructor(scene, isVertical, roadOffset) {
        this.scene = scene;
        this.isVertical = isVertical; // true = moves Z, false = moves X
        this.roadOffset = roadOffset; // snaps to one of the road lines (e.g., -80, 0, 80)
        
        // Offset for lane
        this.laneOffset = (Math.random() > 0.5 ? 1 : -1) * 2.5; 
        
        // Random starting position along the road
        this.pos = (Math.random() - 0.5) * 800;
        
        this.speed = (Math.random() * 10 + 15) * (this.laneOffset > 0 ? 1 : -1);

        this.group = new THREE.Group();
        this.buildMesh();
        
        if (this.isVertical) {
            this.group.position.set(this.roadOffset + this.laneOffset, 0, this.pos);
            this.group.rotation.y = this.speed > 0 ? 0 : Math.PI;
        } else {
            this.group.position.set(this.pos, 0, this.roadOffset + this.laneOffset);
            this.group.rotation.y = this.speed > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
    }

    buildMesh() {
        const carColors = [0x990000, 0x002299, 0xffffff, 0x333333, 0xcccc00];
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: carColors[Math.floor(Math.random() * carColors.length)], 
            roughness: 0.2, 
            metalness: 0.6 
        });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });

        // Lower body
        const bodyGeo = new THREE.BoxGeometry(2, 0.6, 4);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        body.castShadow = true;
        this.group.add(body);

        // Cabin
        const cabinGeo = new THREE.BoxGeometry(1.8, 0.5, 2);
        const cabin = new THREE.Mesh(cabinGeo, glassMat);
        cabin.position.set(0, 1.05, -0.2);
        cabin.castShadow = true;
        this.group.add(cabin);

        // Tires
        const tGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12);
        tGeo.rotateZ(Math.PI / 2);
        
        const poses = [
            [1, 0.3, 1.2], [-1, 0.3, 1.2],
            [1, 0.3, -1.2], [-1, 0.3, -1.2]
        ];
        
        for (let p of poses) {
            const tire = new THREE.Mesh(tGeo, tireMat);
            tire.position.set(...p);
            tire.castShadow = true;
            this.group.add(tire);
        }

        this.scene.add(this.group);
    }

    update(dt) {
        this.pos += this.speed * dt;
        
        // Wrap around
        if (this.pos > 400) this.pos = -400;
        if (this.pos < -400) this.pos = 400;

        if (this.isVertical) {
            this.group.position.z = this.pos;
        } else {
            this.group.position.x = this.pos;
        }
    }
}
