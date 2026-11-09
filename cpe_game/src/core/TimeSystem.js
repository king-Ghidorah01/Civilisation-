export class TimeSystem {
    constructor() {
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.elapsed = 0;
    }

    update() {
        const now = performance.now();
        this.deltaTime = (now - this.lastTime) / 1000.0;
        // Cap delta time to prevent massive jumps during lag/tab switch
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        this.lastTime = now;
        this.elapsed += this.deltaTime;
    }
}
