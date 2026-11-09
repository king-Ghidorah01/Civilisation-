import { PlayerVoice } from '../ai/PlayerVoice.js';
import { BrowserTTSProvider } from '../ai/providers/BrowserTTSProvider.js';

export class DialogueSystem {
    constructor(eventBus, narrator) {
        this.events = eventBus;
        this.narrator = narrator;
        
        this.playerVoice = new PlayerVoice();
        this.npcVoice = new BrowserTTSProvider(); // Reusing the generic TTS for NPC
        
        this.isTalking = false;
        
        this.bindEvents();
    }

    async init() {
        await this.playerVoice.init();
        await this.npcVoice.init();
    }

    bindEvents() {
        this.events.on('InteractNPC', async (npcId) => {
            if (this.isTalking) return;
            this.isTalking = true;
            
            // Interrupt documentary narrator
            this.events.emit('InterruptNarration');

            // Example Conversation
            await this.npcSpeak("Do you know how much energy this facility uses?", 'Engineer', 1.1);
            await this.playerSpeak("Not really. Is it mostly electricity?");
            await this.npcSpeak("Electricity is the useful form we see here. But the interesting part is where it actually comes from.", 'Engineer', 1.1);

            this.isTalking = false;
        });

        this.events.on('InteractPedestrian', async () => {
            if (this.isTalking) return;
            this.isTalking = true;
            this.events.emit('InterruptNarration');

            const phrases = [
                "Beautiful day, isn't it?",
                "I'm just heading to the market.",
                "Have you seen the power plant? It's huge.",
                "Sorry, I'm in a rush!",
                "The city is so busy today."
            ];
            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
            
            // Random pitch for different people
            const randomPitch = 0.8 + Math.random() * 0.6;
            
            await this.npcSpeak(phrase, 'Citizen', randomPitch);
            this.isTalking = false;
        });
    }

    async playerSpeak(text) {
        this.narrator.showSubtitle(`[Player] ${text}`);
        await this.playerVoice.play(text);
        this.narrator.hideSubtitles();
    }

    async npcSpeak(text, name = 'NPC', pitch = 1.0) {
        this.narrator.showSubtitle(`[${name}] ${text}`);
        await this.npcVoice.play(text, { pitch: pitch, rate: 1.0 });
        this.narrator.hideSubtitles();
    }
}
