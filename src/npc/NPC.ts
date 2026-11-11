import * as THREE from 'three';

export class NPC {
    public mesh: THREE.Group;
    public name: string;
    public profession: string;
    public knowledgeDomain: string;

    constructor(scene: THREE.Scene, position: THREE.Vector3, name: string, profession: string, knowledge: string, color: number) {
        this.name = name;
        this.profession = profession;
        this.knowledgeDomain = knowledge;

        this.mesh = this.generateMesh(color);
        this.mesh.position.copy(position);

        this.updateScannerData();

        scene.add(this.mesh);
    }

    private generateMesh(color: number): THREE.Group {
        const group = new THREE.Group();

        // Body
        const bodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
        const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa }); // simplified skin tone
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.4;
        head.castShadow = true;
        group.add(head);

        group.userData = { inspectable: true, data: {} };
        body.userData = group.userData;
        head.userData = group.userData;

        return group;
    }

    private updateScannerData(): void {
        this.mesh.userData.data = {
            "Entity": "Civilian (NPC)",
            "Name": this.name,
            "Profession": this.profession,
            "Domain": this.knowledgeDomain,
            "Action": "Press 'T' to Talk (NYI)"
        };
    }
}
