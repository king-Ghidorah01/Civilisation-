import React, { useState, useEffect } from 'react';
import { EventBus } from '../core/EventBus';
import { GameState } from '../core/GameState';

interface AppUIProps {
    eventBus: EventBus;
    gameState: GameState;
}

export const AppUI: React.FC<AppUIProps> = ({ eventBus, gameState }) => {
    const [started, setStarted] = useState(false);
    const [civLevel, setCivLevel] = useState(gameState.civilizationLevel);
    const [energy, setEnergy] = useState(gameState.totalEnergyConsumptionTW);
    const [scannerData, setScannerData] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const handleUpdate = () => {
            setCivLevel(gameState.civilizationLevel);
            setEnergy(gameState.totalEnergyConsumptionTW);
        };

        const handleInspect = (data: Record<string, any>) => {
            setScannerData(data);
        };

        const handleClear = () => {
            setScannerData(null);
        };

        eventBus.on('game:update', handleUpdate);
        eventBus.on('scanner:inspect', handleInspect);
        eventBus.on('scanner:clear', handleClear);

        return () => {
            eventBus.off('game:update', handleUpdate);
            eventBus.off('scanner:inspect', handleInspect);
            eventBus.off('scanner:clear', handleClear);
        };
    }, [eventBus, gameState]);

    const handleStart = () => {
        setStarted(true);
        eventBus.emit('ui:start_clicked');
    };

    if (!started) {
        return (
            <div id="main-menu" className="panel">
                <h1>CIVILIZATION</h1>
                <h2>A Journey Through Physics</h2>
                <button id="btn-start" onClick={handleStart}>BEGIN JOURNEY</button>
            </div>
        );
    }

    return (
        <div id="hud">
            <div id="crosshair">+</div>
            <div id="dashboard">
                <div>CIVILIZATION LEVEL: <span>{civLevel.toFixed(2)}</span></div>
                <div>GLOBAL ENERGY: <span>{energy.toFixed(1)}</span> TW</div>
            </div>

            {scannerData && (
                <div id="scanner-panel" className="panel">
                    <h3>INSPECTION DATA</h3>
                    <div id="scanner-content">
                        {Object.entries(scannerData).map(([key, value]) => (
                            <div key={key}><strong>{key}:</strong> {value}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
