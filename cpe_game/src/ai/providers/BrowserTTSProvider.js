import { VoiceProvider } from './VoiceProvider.js';

export class BrowserTTSProvider extends VoiceProvider {
    constructor() {
        super();
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.isReady = false;
    }

    async init() {
        return new Promise((resolve) => {
            const loadVoices = () => {
                const voices = this.synth.getVoices();
                if (voices.length > 0) {
                    // Try to find a warm, cinematic female voice
                    // Priority: Google UK Female -> Samantha -> Microsoft Zira -> any female
                    this.voice = voices.find(v => v.name.includes('Google UK English Female')) ||
                                 voices.find(v => v.name.includes('Samantha')) ||
                                 voices.find(v => v.name.includes('Zira')) ||
                                 voices.find(v => v.name.toLowerCase().includes('female')) ||
                                 voices[0]; // fallback
                    this.isReady = true;
                    resolve(true);
                }
            };
            
            loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = loadVoices;
            } else {
                setTimeout(loadVoices, 1000); // Safari fallback
            }
        });
    }

    play(text, options = {}) {
        return new Promise((resolve) => {
            if (!this.synth) resolve();
            
            this.cancel(); // Interrupt previous
            
            const utterance = new SpeechSynthesisUtterance(text);
            if (this.voice) utterance.voice = this.voice;
            
            utterance.rate = options.rate || 0.95; // Slightly slower for cinematic calm
            utterance.pitch = options.pitch || 0.98; // Slightly lower for warmth/confidence
            utterance.volume = options.volume || 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve(); // continue even on error

            this.synth.speak(utterance);
        });
    }

    pause() {
        if (this.synth.speaking) this.synth.pause();
    }

    resume() {
        if (this.synth.paused) this.synth.resume();
    }

    cancel() {
        if (this.synth.speaking) this.synth.cancel();
    }
}
