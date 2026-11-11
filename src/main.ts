import { Game } from './core/Game';
import { Renderer } from './rendering/Renderer';
import { Lighting } from './rendering/Lighting';
import { HUD } from './ui/HUD';
import { PlayerController } from './player/PlayerController';
import { WorldManager } from './world/WorldManager';

class CivilizationApp {
    private game: Game;
    private renderer: Renderer;
    public lighting: Lighting;
    public hud: HUD;
    private player: PlayerController;
    private worldManager: WorldManager;

    constructor() {
        // Initialize Core
        this.game = new Game();

        // Initialize Rendering
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.renderer = new Renderer(canvas);
        this.lighting = new Lighting(this.renderer.scene);

        // Initialize UI
        this.hud = new HUD(this.game.eventBus, this.game.state);

        // Initialize Player Controller
        this.player = new PlayerController(
            this.renderer.scene,
            this.renderer.camera,
            this.game.input,
            this.game.eventBus
        );

        // Initialize World
        this.worldManager = new WorldManager(this.renderer.scene);

        // Setup Game Loop binding
        this.game.eventBus.on('game:start', () => {
            this.worldManager.loadEarthStage();
            // Pass interactable items to the player's scanner
            this.player.setInteractableObjects(this.worldManager.getInteractables());
        });

        this.game.eventBus.on('game:update', (dt: number) => {
            this.update(dt);
        });

        // Begin application (UI handles actual game start)
        this.game.start();
    }

    private update(dt: number): void {
        this.player.update(dt);
        this.renderer.render();
    }
}

// Bootstrap
window.onload = () => {
    new CivilizationApp();
};
