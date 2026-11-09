import { BrowserTTSProvider } from './providers/BrowserTTSProvider.js';

export class Narrator {
    constructor(eventBus) {
        this.events = eventBus;
        this.provider = new BrowserTTSProvider();
        
        this.currentSequenceId = null;
        this.isPlaying = false;
        
        this.scripts = {};
        
        this.settings = {
            volume: 1.0,
            subtitlesEnabled: true
        };

        this.subtitleElement = null;
        this.bindEvents();
    }

    async init() {
        await this.provider.init();
        this.setupUI();
        await this.loadScript('earth');
    }

    async loadScript(stageName) {
        try {
            const response = await fetch(`narration/${stageName}.json`);
            if (response.ok) {
                const data = await response.json();
                this.scripts[stageName] = data.sequences;
            }
        } catch (e) {
            console.warn(`Failed to load narration for ${stageName}`);
        }
    }

    setupUI() {
        const uiLayer = document.getElementById('ui-layer');
        if (!uiLayer) return;
        this.subtitleElement = document.createElement('div');
        this.subtitleElement.id = 'cinematic-subtitles';
        this.subtitleElement.className = 'hidden';
        uiLayer.appendChild(this.subtitleElement);
    }

    bindEvents() {
        this.events.on('WorldLoaded', (worldName) => {
            if (worldName === 'PRESENT_EARTH') {
                this.triggerSequence('earth', 'earth_intro');
            }
        });

        this.events.on('InspectPowerPlant', () => {
            this.triggerSequence('earth', 'inspect_power');
        });

        this.events.on('InterruptNarration', () => {
            this.cancelCurrent();
        });

        this.events.on('ToggleMute', () => {
            this.settings.volume = this.settings.volume > 0 ? 0 : 1.0;
            if (this.settings.volume === 0) {
                this.provider.cancel();
                this.hideSubtitles();
                this.isPlaying = false;
                this.currentSequenceId = null;
            }
        });
    }

    triggerSequence(stage, sequenceId) {
        if (!this.scripts[stage]) return;
        const seq = this.scripts[stage].find(s => s.id === sequenceId);
        if (!seq) return;

        // Priority handling
        if (this.isPlaying) {
            if (seq.priority === 'HIGH') {
                this.cancelCurrent();
            } else {
                return; // Ignore if busy and not high priority
            }
        }

        this.playSequence(seq);
    }

    async playSequence(sequence) {
        this.isPlaying = true;
        this.currentSequenceId = sequence.id;

        if (sequence.delay) {
            await new Promise(r => setTimeout(r, sequence.delay));
        }

        for (const line of sequence.lines) {
            if (!this.isPlaying || this.currentSequenceId !== sequence.id) break; // Interrupted

            if (line.delay) {
                await new Promise(r => setTimeout(r, line.delay));
            }

            if (!this.isPlaying || this.currentSequenceId !== sequence.id) break;

            this.showSubtitle(line.text);
            await this.provider.play(line.text, { volume: this.settings.volume });
            this.hideSubtitles();
        }

        if (this.currentSequenceId === sequence.id) {
            this.isPlaying = false;
            this.currentSequenceId = null;
        }
    }

    cancelCurrent() {
        this.isPlaying = false;
        this.currentSequenceId = null;
        this.provider.cancel();
        this.hideSubtitles();
    }

    showSubtitle(text) {
        if (!this.settings.subtitlesEnabled || !this.subtitleElement) return;
        this.subtitleElement.innerText = text;
        this.subtitleElement.classList.remove('hidden');
        this.subtitleElement.classList.add('visible');
    }

    hideSubtitles() {
        if (this.subtitleElement) {
            this.subtitleElement.classList.remove('visible');
            this.subtitleElement.classList.add('hidden');
        }
    }
}
