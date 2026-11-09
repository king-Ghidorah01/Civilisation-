export class VoiceProvider {
    /**
     * Interface for Voice Providers
     */
    constructor() {
        if (new.target === VoiceProvider) {
            throw new TypeError("Cannot construct VoiceProvider instances directly");
        }
    }

    async init() { throw new Error("Method not implemented"); }
    play(text, options) { throw new Error("Method not implemented"); }
    pause() { throw new Error("Method not implemented"); }
    resume() { throw new Error("Method not implemented"); }
    cancel() { throw new Error("Method not implemented"); }
}
