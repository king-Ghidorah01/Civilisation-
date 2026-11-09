import { EarthWorld } from './EarthWorld.js';

export class WorldManager {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.events = eventBus;
        this.currentWorld = null;
        
        this.events.on('Interact', () => {
            // Need player position. Passed in update, but for interact, let's just trigger and let world get it if needed, or we can fetch it.
            // Better to just let the world use its own state or pass it.
        });
    }

    loadWorld(worldName) {
        if (this.currentWorld) {
            this.scene.remove(this.currentWorld.worldGroup);
        }

        switch (worldName) {
            case 'PRESENT_EARTH':
                this.currentWorld = new EarthWorld(this.scene, this.events);
                break;
            default:
                console.warn(`World ${worldName} not found.`);
        }
    }

    update(dt, playerPosition) {
        if (this.currentWorld) {
            this.currentWorld.update(dt, playerPosition);
        }
    }
}
