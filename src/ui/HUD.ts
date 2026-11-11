import { EventBus } from '../core/EventBus';
import { GameState } from '../core/GameState';

export class HUD {
    private eventBus: EventBus;
    private state: GameState;

    private menuEl: HTMLElement;
    private hudEl: HTMLElement;
    private startBtn: HTMLButtonElement;

    private civLevelEl: HTMLElement;
    private civEnergyEl: HTMLElement;

    private scannerPanelEl: HTMLElement;
    private scannerContentEl: HTMLElement;

    constructor(eventBus: EventBus, state: GameState) {
        this.eventBus = eventBus;
        this.state = state;

        this.menuEl = document.getElementById('main-menu')!;
        this.hudEl = document.getElementById('hud')!;
        this.startBtn = document.getElementById('btn-start') as HTMLButtonElement;

        this.civLevelEl = document.getElementById('civ-level')!;
        this.civEnergyEl = document.getElementById('civ-energy')!;

        this.scannerPanelEl = document.getElementById('scanner-panel')!;
        this.scannerContentEl = document.getElementById('scanner-content')!;

        this.startBtn.addEventListener('click', () => {
            this.menuEl.classList.add('hidden');
            this.hudEl.classList.remove('hidden');
            this.eventBus.emit('ui:start_clicked');
        });

        this.eventBus.on('game:update', this.updateDashboard.bind(this));
        this.eventBus.on('scanner:inspect', this.showInspectionData.bind(this));
        this.eventBus.on('scanner:clear', this.hideInspectionData.bind(this));
    }

    private updateDashboard(): void {
        this.civLevelEl.innerText = this.state.civilizationLevel.toFixed(2);
        this.civEnergyEl.innerText = this.state.totalEnergyConsumptionTW.toFixed(1);
    }

    private showInspectionData(data: Record<string, any>): void {
        this.scannerPanelEl.classList.remove('hidden');
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            html += `<div><strong>${key}:</strong> ${value}</div>`;
        }
        this.scannerContentEl.innerHTML = html;
    }

    private hideInspectionData(): void {
        this.scannerPanelEl.classList.add('hidden');
    }
}
