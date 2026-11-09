export class PlayerVoice {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
    }

    async init() {
        return new Promise((resolve) => {
            const loadVoices = () => {
                const voices = this.synth.getVoices();
                if (voices.length > 0) {
                    // Try to find a male voice
                    this.voice = voices.find(v => v.name.includes('Google UK English Male')) ||
                                 voices.find(v => v.name.includes('David')) ||
                                 voices.find(v => v.name.toLowerCase().includes('male')) ||
                                 voices[1] || voices[0];
                    resolve(true);
                }
            };
            
            loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = loadVoices;
            }
        });
    }

    play(text) {
        return new Promise((resolve) => {
            if (!this.synth) resolve();
            this.synth.cancel(); // Interrupt previous
            const utterance = new SpeechSynthesisUtterance(text);
            if (this.voice) utterance.voice = this.voice;
            
            utterance.rate = 0.98; 
            utterance.pitch = 0.9; // Slightly deeper
            
            utterance.onend = () => resolve();
            this.synth.speak(utterance);
        });
    }
}
