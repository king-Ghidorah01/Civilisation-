import { Game } from './core/Game.js';

window.onload = () => {
    // Bootstrap the game application
    const app = new Game();
    app.init();
};
