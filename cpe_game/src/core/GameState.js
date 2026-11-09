export class GameState {
    constructor() {
        this.stage = 'PRESENT_EARTH';
        this.playerData = {
            position: { x: 0, y: 0, z: 0 },
            discoveries: []
        };
        this.simulationParams = {
            energyMultiplier: 1.0,
            industrialCapacity: 1.0
        };
    }
}
