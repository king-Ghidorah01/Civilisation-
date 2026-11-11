import { EventBus } from './EventBus';
import { GameState } from './GameState';
import { TimeSystem } from './TimeSystem';
import { InputSystem } from './InputSystem';

export class Game {
    public eventBus: EventBus;
    public state: GameState;
    public time: TimeSystem;
    public input: InputSystem;

    private isRunning: boolean = false;

    constructor() {
        this.eventBus = new EventBus();
        this.state = new GameState();
        this.time = new TimeSystem();
        this.input = new InputSystem();
    }

    public start(): void {
        this.isRunning = true;
        this.eventBus.emit('game:start');
        requestAnimationFrame((t) => this.loop(t));
    }

    private loop(currentTimeMs: number): void {
        if (!this.isRunning) return;

        this.time.update(currentTimeMs);

        // Update logic will go here
        this.eventBus.emit('game:update', this.time.deltaTime);

        // Reset input delta at end of frame
        this.input.resetMouseDelta();

        requestAnimationFrame((t) => this.loop(t));
    }

    public stop(): void {
        this.isRunning = false;
    }
}
