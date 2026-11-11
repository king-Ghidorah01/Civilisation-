export class TimeSystem {
    private previousTime: number = 0;
    public deltaTime: number = 0;
    public totalTime: number = 0;
    public timeScale: number = 1.0; // For simulation speedup (e.g. 1 sec = 1 year later)

    public update(currentTimeMs: number): void {
        const currentTimeInSeconds = currentTimeMs / 1000;
        this.deltaTime = currentTimeInSeconds - this.previousTime;

        // Prevent massive jumps if tab was in background
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.016;
        }

        this.totalTime += this.deltaTime * this.timeScale;
        this.previousTime = currentTimeInSeconds;
    }
}
