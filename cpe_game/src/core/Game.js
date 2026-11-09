import { EventBus } from './EventBus.js';
import { GameState } from './GameState.js';
import { TimeSystem } from './TimeSystem.js';
import { InputSystem } from './InputSystem.js';
import { Renderer } from '../rendering/Renderer.js';
import { Lighting } from '../rendering/Lighting.js';
import { WorldManager } from '../world/WorldManager.js';
import { Player } from '../player/Player.js';
import { Narrator } from '../ai/Narrator.js';
import { DialogueSystem } from '../npc/DialogueSystem.js';

export class Game {
    constructor() {
        this.events = new EventBus();
        this.state = new GameState();
        this.time = new TimeSystem();
        this.input = new InputSystem(this.events);
        
        this.renderer = null;
        this.lighting = null;
        this.worldManager = null;
        this.player = null;
        this.narrator = new Narrator(this.events);
        
        this.isRunning = false;
        
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        this.events.on('PointerLockChanged', (locked) => {
            const hud = document.getElementById('hud');
            const menu = document.getElementById('main-menu');
            if (locked) {
                hud.classList.remove('hidden');
                menu.classList.add('hidden');
            } else if (this.isRunning) {
                hud.classList.add('hidden');
                menu.classList.remove('hidden');
            }
        });

        const muteBtn = document.getElementById('btn-mute');
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent pointer lock trigger
            this.events.emit('ToggleMute');
            if (muteBtn.innerText === '🔊') {
                muteBtn.innerText = '🔇';
            } else {
                muteBtn.innerText = '🔊';
            }
        });

        this.events.on('Interact', () => {
            if (this.worldManager.currentWorld && this.worldManager.currentWorld.onInteract) {
                this.worldManager.currentWorld.onInteract(this.player.position);
            }
        });
    }

    async init() {
        // Initialize Core Graphics
        this.renderer = new Renderer('game-container');
        this.lighting = new Lighting(this.renderer.scene);
        
        // Initialize Systems
        this.worldManager = new WorldManager(this.renderer.scene, this.events);
        this.player = new Player(this.renderer.scene, this.input, this.worldManager);
        
        // Initialize AI
        await this.narrator.init();
        this.dialogueSystem = new DialogueSystem(this.events, this.narrator);
        await this.dialogueSystem.init();
        
        // Simulate loading time
        setTimeout(() => {
            document.getElementById('loading-screen').classList.replace('active', 'hidden');
            document.getElementById('main-menu').classList.remove('hidden');
        }, 1500);
        
        // Preload Earth
        this.worldManager.loadWorld(this.state.stage);
        this.events.emit('WorldLoaded', this.state.stage);

        // Start render loop immediately for background
        this.loop();
    }

    startGame() {
        if (!this.isRunning) {
            this.isRunning = true;
        }
        document.body.requestPointerLock();
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        
        this.time.update();
        const dt = this.time.deltaTime;

        if (this.isRunning && this.input.mouse.locked) {
            this.player.update(dt);
            this.worldManager.update(dt, this.player.position);
        }

        this.renderer.render(this.player.camera.camera);
    }
}
