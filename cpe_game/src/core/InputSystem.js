export class InputSystem {
    constructor(eventBus) {
        this.events = eventBus;
        this.keys = {};
        this.mouse = { x: 0, y: 0, dx: 0, dy: 0, locked: false };
        
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyE' && this.mouse.locked) {
                this.events.emit('Interact');
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement) {
                this.mouse.dx = e.movementX;
                this.mouse.dy = e.movementY;
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.mouse.locked = !!document.pointerLockElement;
            this.events.emit('PointerLockChanged', this.mouse.locked);
        });

        // Click to lock
        document.getElementById('game-container').addEventListener('click', () => {
            if (!this.mouse.locked) {
                document.body.requestPointerLock();
            }
        });
    }

    isPressed(code) {
        return !!this.keys[code];
    }
    
    consumeMouseDelta() {
        const dx = this.mouse.dx;
        const dy = this.mouse.dy;
        this.mouse.dx = 0;
        this.mouse.dy = 0;
        return { dx, dy };
    }
}
