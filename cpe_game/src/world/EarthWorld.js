import * as THREE from 'three';
import { Pedestrian } from '../npc/Pedestrian.js';
import { Vehicle } from '../npc/Vehicle.js';

export class EarthWorld {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.events = eventBus;
        this.worldGroup = new THREE.Group();
        this.scene.add(this.worldGroup);
        
        this.powerPlant = null;
        this.npc = null;
        this.pedestrians = [];
        this.vehicles = [];
        this.playerWanderTriggered = false;

        this.buildEnvironment();
    }

    buildEnvironment() {
        // Procedural Textures
        const roadTex = this.createRoadTexture();
        const windowTex = this.createWindowTexture();
        const buildingColors = [0xaaaaaa, 0x556677, 0x887766, 0x334455, 0x222222];
        
        this.buildings = []; // Store for collision

        // Ground (Grass/Dirt)
        const groundGeo = new THREE.PlaneGeometry(1000, 1000);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x1d331d, roughness: 1.0 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.worldGroup.add(ground);

        // Main Road Grid
        const roadMat = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            roughness: 0.9,
            map: roadTex
        });
        
        // Vertical Roads & Sidewalks
        for(let i = -3; i <= 3; i++) {
            const x = i * 80;
            
            // Road
            const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 600), roadMat);
            road.rotation.x = -Math.PI / 2;
            road.position.set(x, 0.05, 0);
            road.receiveShadow = true;
            this.worldGroup.add(road);
            
            // Sidewalks
            const swGeo = new THREE.PlaneGeometry(4, 600);
            const swMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 1.0 });
            const swL = new THREE.Mesh(swGeo, swMat);
            swL.rotation.x = -Math.PI / 2;
            swL.position.set(x - 8, 0.08, 0);
            swL.receiveShadow = true;
            this.worldGroup.add(swL);
            
            const swR = new THREE.Mesh(swGeo, swMat);
            swR.rotation.x = -Math.PI / 2;
            swR.position.set(x + 8, 0.08, 0);
            swR.receiveShadow = true;
            this.worldGroup.add(swR);

            // Streetlights & Markets along vertical roads
            for(let z = -250; z <= 250; z += 40) {
                if (Math.abs(z % 80) < 15) continue; // Skip intersection

                // Streetlight
                const slGeo = new THREE.CylinderGeometry(0.1, 0.2, 5, 8);
                const slMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
                const pole = new THREE.Mesh(slGeo, slMat);
                pole.position.set(x - 6.5, 2.5, z);
                pole.castShadow = true;
                
                const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshBasicMaterial({color:0xffffaa}));
                bulb.position.set(0, 2.5, 0);
                pole.add(bulb);
                
                // Add a small pointlight
                const pLight = new THREE.PointLight(0xffffaa, 0.5, 30);
                pLight.position.set(0, 2.5, 0);
                pole.add(pLight);
                
                this.worldGroup.add(pole);

                // Market Stall
                if (Math.random() > 0.5) {
                    const stall = new THREE.Group();
                    const table = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), new THREE.MeshStandardMaterial({color: 0x8b5a2b}));
                    table.position.y = 0.5;
                    stall.add(table);
                    
                    const awningColor = Math.random() > 0.5 ? 0xcc2222 : 0x2222cc;
                    const awning = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 2.5), new THREE.MeshStandardMaterial({color: awningColor}));
                    awning.position.y = 2.0;
                    awning.rotation.x = 0.1;
                    stall.add(awning);
                    
                    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), slMat);
                    p1.position.set(-1.4, 1, -0.8);
                    stall.add(p1);
                    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), slMat);
                    p2.position.set(1.4, 1, -0.8);
                    stall.add(p2);
                    
                    stall.position.set(x + 10, 0, z);
                    stall.rotation.y = -Math.PI / 2;
                    this.worldGroup.add(stall);
                }
            }
            
            // Spawn vehicles
            for(let j = 0; j < 3; j++) {
                this.vehicles.push(new Vehicle(this.worldGroup, true, i * 80));
            }
        }
        
        // Horizontal Roads & Sidewalks
        for(let i = -3; i <= 3; i++) {
            const z = i * 80;
            
            // Road
            const road = new THREE.Mesh(new THREE.PlaneGeometry(600, 12), roadMat);
            road.rotation.x = -Math.PI / 2;
            road.position.set(0, 0.06, z);
            road.receiveShadow = true;
            this.worldGroup.add(road);

            // Sidewalks
            const swGeo = new THREE.PlaneGeometry(600, 4);
            const swMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 1.0 });
            const swT = new THREE.Mesh(swGeo, swMat);
            swT.rotation.x = -Math.PI / 2;
            swT.position.set(0, 0.08, z - 8);
            swT.receiveShadow = true;
            this.worldGroup.add(swT);
            
            const swB = new THREE.Mesh(swGeo, swMat);
            swB.rotation.x = -Math.PI / 2;
            swB.position.set(0, 0.08, z + 8);
            swB.receiveShadow = true;
            this.worldGroup.add(swB);

            // Streetlights
            for(let x = -250; x <= 250; x += 40) {
                if (Math.abs(x % 80) < 15) continue; // Skip intersection

                const slGeo = new THREE.CylinderGeometry(0.1, 0.2, 5, 8);
                const slMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
                const pole = new THREE.Mesh(slGeo, slMat);
                pole.position.set(x, 2.5, z - 6.5);
                pole.castShadow = true;
                
                const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshBasicMaterial({color:0xffffaa}));
                bulb.position.set(0, 2.5, 0);
                pole.add(bulb);
                
                const pLight = new THREE.PointLight(0xffffaa, 0.5, 30);
                pLight.position.set(0, 2.5, 0);
                pole.add(pLight);
                
                this.worldGroup.add(pole);
            }

            // Spawn vehicles on horizontal roads
            for(let j = 0; j < 3; j++) {
                this.vehicles.push(new Vehicle(this.worldGroup, false, z));
            }
        }

        // Power Plant (Professional)
        const ppGroup = new THREE.Group();
        const ppMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.3 });
        const ppCore = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 40, 32), ppMat);
        ppCore.position.y = 20;
        ppCore.castShadow = true;
        ppCore.receiveShadow = true;
        ppGroup.add(ppCore);
        
        const ppSmoke = new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 30, 16), ppMat);
        ppSmoke.position.set(15, 15, -10);
        ppSmoke.castShadow = true;
        ppGroup.add(ppSmoke);
        
        ppGroup.position.set(40, 0, -50);
        this.powerPlant = ppCore; // For interaction target
        this.worldGroup.add(ppGroup);
        
        this.buildings.push({
            minX: 40 - 15, maxX: 40 + 15,
            minZ: -50 - 15, maxZ: -50 + 15
        }); // Power plant bounds

        // Professional City Blocks
        for (let i = 0; i < 250; i++) {
            const isSkyscraper = Math.random() > 0.8;
            const width = isSkyscraper ? (15 + Math.random() * 10) : (10 + Math.random() * 20);
            const height = isSkyscraper ? (60 + Math.random() * 100) : (10 + Math.random() * 30);
            
            const bMat = new THREE.MeshStandardMaterial({ 
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)], 
                roughness: isSkyscraper ? 0.2 : 0.8,
                metalness: isSkyscraper ? 0.8 : 0.1,
                map: isSkyscraper ? windowTex : null
            });
            
            const bGeo = new THREE.BoxGeometry(width, height, width);
            const bMesh = new THREE.Mesh(bGeo, bMat);
            
            let x = (Math.random() - 0.5) * 500;
            let z = (Math.random() - 0.5) * 500;
            
            // Snap to blocks (avoid roads)
            x = Math.round(x / 80) * 80 + 40;
            z = Math.round(z / 80) * 80 + 40;
            
            // Add some jitter within the block
            x += (Math.random() - 0.5) * 30;
            z += (Math.random() - 0.5) * 30;
            
            // Keep center clear for player spawn
            if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;
            // Keep power plant area clear
            if (Math.hypot(x - 40, z + 50) < 50) continue;
            
            bMesh.position.set(x, height / 2, z);
            bMesh.castShadow = true;
            bMesh.receiveShadow = true;
            this.worldGroup.add(bMesh);
            
            this.buildings.push({
                minX: x - width/2, maxX: x + width/2,
                minZ: z - width/2, maxZ: z + width/2
            });
        }

        // Spawn Trees
        const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x1b441b, roughness: 0.9 });
        const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });
        
        for (let i = 0; i < 300; i++) {
            let x = (Math.random() - 0.5) * 500;
            let z = (Math.random() - 0.5) * 500;
            
            // Don't spawn on roads
            if (Math.abs(x % 80) < 8 || Math.abs(z % 80) < 8) continue;
            if (Math.hypot(x - 40, z + 50) < 40) continue;

            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3, 5), treeTrunkMat);
            trunk.position.y = 1.5;
            trunk.castShadow = true;
            tree.add(trunk);
            
            const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(2, 1), treeLeavesMat);
            leaves.position.y = 3.5;
            leaves.castShadow = true;
            tree.add(leaves);
            
            tree.position.set(x, 0, z);
            this.worldGroup.add(tree);
        }

        // Spawn Pedestrians
        for (let i = 0; i < 40; i++) {
            let x = (Math.random() - 0.5) * 200;
            let z = (Math.random() - 0.5) * 200;
            this.pedestrians.push(new Pedestrian(this.worldGroup, x, z));
        }

        // Spawn Birds (Animals)
        this.birds = new THREE.Group();
        const birdGeo = new THREE.ConeGeometry(0.5, 1.5, 3);
        birdGeo.rotateX(Math.PI / 2); // point forward
        const birdMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        
        for (let i = 0; i < 50; i++) {
            const bird = new THREE.Mesh(birdGeo, birdMat);
            bird.position.set(
                (Math.random() - 0.5) * 400,
                30 + Math.random() * 50, // fly high
                (Math.random() - 0.5) * 400
            );
            // Store flight variables
            bird.userData = {
                speed: 10 + Math.random() * 10,
                angle: Math.random() * Math.PI * 2,
                wobble: Math.random() * 10
            };
            this.birds.add(bird);
        }
        this.worldGroup.add(this.birds);

        // Add a stickman NPC (Engineer)
        this.npc = new THREE.Group();
        
        const npcSkin = new THREE.MeshStandardMaterial({ color: 0xddaa88, roughness: 0.6 });
        const npcShirt = new THREE.MeshStandardMaterial({ color: 0xee8822, roughness: 0.8 }); // Orange vest/shirt
        const npcPants = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
        const npcHairMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 }); // Grey hair
        const featureMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });
        
        const npcTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 12), npcShirt);
        npcTorso.position.y = 0.8; // FIXED FLOATING
        npcTorso.castShadow = true;
        this.npc.add(npcTorso);
        
        const npcHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), npcSkin);
        npcHead.position.y = 0.45;
        
        const npcHair = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), npcHairMat);
        npcHair.position.y = 0.02;
        npcHead.add(npcHair);

        const npcLeftEye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), featureMat);
        npcLeftEye.position.set(-0.06, 0.02, 0.17);
        npcHead.add(npcLeftEye);
        
        const npcRightEye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), featureMat);
        npcRightEye.position.set(0.06, 0.02, 0.17);
        npcHead.add(npcRightEye);

        const npcMouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.01, 0.06, 4, 8), featureMat);
        npcMouth.rotation.z = Math.PI / 2;
        npcMouth.position.set(0, -0.06, 0.175);
        npcHead.add(npcMouth);

        npcTorso.add(npcHead);

        const npcLArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), npcSkin);
        npcLArm.position.set(-0.22, -0.1, 0);
        npcTorso.add(npcLArm);
        
        const npcLShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), npcShirt);
        npcLShoulder.position.set(-0.22, 0.125, 0);
        npcTorso.add(npcLShoulder);

        const npcRArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), npcSkin);
        npcRArm.position.set(0.22, -0.1, 0);
        npcTorso.add(npcRArm);
        
        const npcRShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), npcShirt);
        npcRShoulder.position.set(0.22, 0.125, 0);
        npcTorso.add(npcRShoulder);

        const npcLLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), npcPants);
        npcLLeg.position.set(-0.08, -0.55, 0);
        npcTorso.add(npcLLeg);
        
        const npcLHip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), npcPants);
        npcLHip.position.set(-0.08, -0.3, 0);
        npcTorso.add(npcLHip);

        const npcRLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), npcPants);
        npcRLeg.position.set(0.08, -0.55, 0);
        npcTorso.add(npcRLeg);
        
        const npcRHip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), npcPants);
        npcRHip.position.set(0.08, -0.3, 0);
        npcTorso.add(npcRHip);

        // Turn NPC to face player generally
        this.npc.rotation.y = Math.PI / 4;
        this.npc.position.set(30, 0, -40);
        this.worldGroup.add(this.npc);
    }

    update(dt, playerPosition) {
        // Distance check to power plant
        const distToPlant = playerPosition.distanceTo(this.powerPlant.position);
        
        // Contextual Narration: Approaching power plant
        if (distToPlant < 30 && !this.powerPlantTriggered) {
            this.powerPlantTriggered = true;
            this.events.emit('InspectPowerPlant');
        }

        // Contextual Narration: Wandering away from city
        const distToCenter = Math.hypot(playerPosition.x, playerPosition.z);
        if (distToCenter > 150 && !this.playerWanderTriggered) {
            this.playerWanderTriggered = true;
            this.events.emit('PlayerWandering');
        }

        // Update pedestrians
        for (const ped of this.pedestrians) {
            ped.update(dt);
        }

        // Update vehicles
        for (const veh of this.vehicles) {
            veh.update(dt);
        }

        // Update birds
        if (this.birds) {
            for (const bird of this.birds.children) {
                bird.userData.wobble += dt;
                bird.userData.angle += Math.sin(bird.userData.wobble) * dt * 0.5;
                
                bird.rotation.y = bird.userData.angle;
                
                const moveDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0,1,0), bird.userData.angle);
                bird.position.addScaledVector(moveDir, bird.userData.speed * dt);
                
                // Wrap around
                if (bird.position.x > 300) bird.position.x = -300;
                if (bird.position.x < -300) bird.position.x = 300;
                if (bird.position.z > 300) bird.position.z = -300;
                if (bird.position.z < -300) bird.position.z = 300;
            }
        }
    }

    onInteract(playerPosition) {
        if (playerPosition.distanceTo(this.npc.position) < 5) {
            this.events.emit('InteractNPC', 'engineer_1');
            return;
        } 
        
        // Check pedestrians
        for (const ped of this.pedestrians) {
            if (playerPosition.distanceTo(ped.group.position) < 4) {
                this.events.emit('InteractPedestrian');
                return;
            }
        }

        if (playerPosition.distanceTo(this.powerPlant.position) < 20) {
            console.log("Scanner: Power Plant. Heat output: 2GW");
        }
    }

    checkCollision(x, z, radius) {
        for (const b of this.buildings) {
            // AABB collision check
            if (x + radius > b.minX && x - radius < b.maxX &&
                z + radius > b.minZ && z - radius < b.maxZ) {
                return true;
            }
        }
        return false;
    }

    createWindowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#111111'; // Base building color
        ctx.fillRect(0, 0, 256, 256);
        
        // Draw windows
        for (let y = 10; y < 256; y += 30) {
            for (let x = 10; x < 256; x += 20) {
                // Randomly light up some windows
                if (Math.random() > 0.3) {
                    ctx.fillStyle = Math.random() > 0.8 ? '#ffffcc' : '#557799'; // Lights on or sky reflection
                } else {
                    ctx.fillStyle = '#050505'; // Off window
                }
                ctx.fillRect(x, y, 15, 20);
            }
        }
        
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 6);
        return tex;
    }

    createRoadTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, 512, 512);
        
        // Dashed center line
        ctx.strokeStyle = '#ddaa00'; // Yellow line
        ctx.lineWidth = 10;
        ctx.setLineDash([40, 40]);
        ctx.beginPath();
        ctx.moveTo(256, 0);
        ctx.lineTo(256, 512);
        ctx.stroke();

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 10);
        return tex;
    }
}
