export class InputSystem {
    public keys: Map<string, boolean> = new Map();
    public isPointerLocked: boolean = false;

    // Mouse movement
    public movementX: number = 0;
    public movementY: number = 0;

    constructor() {
        window.addEventListener('keydown', (e) => this.keys.set(e.code, true));
        window.addEventListener('keyup', (e) => this.keys.set(e.code, false));

        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.movementX = e.movementX || 0;
                this.movementY = e.movementY || 0;
            }
        });
    }

    public isKeyPressed(code: string): boolean {
        return this.keys.get(code) || false;
    }

    public requestPointerLock(element: HTMLElement): void {
        element.requestPointerLock();
    }

    public exitPointerLock(): void {
        document.exitPointerLock();
    }

    public resetMouseDelta(): void {
        this.movementX = 0;
        this.movementY = 0;
    }
}
