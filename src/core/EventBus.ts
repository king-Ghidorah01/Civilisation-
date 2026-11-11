export type EventHandler = (data: any) => void;

export class EventBus {
    private listeners: Map<string, EventHandler[]> = new Map();

    public on(event: string, handler: EventHandler): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(handler);
    }

    public off(event: string, handler: EventHandler): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            this.listeners.set(event, eventListeners.filter(h => h !== handler));
        }
    }

    public emit(event: string, data?: any): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            for (const handler of eventListeners) {
                handler(data);
            }
        }
    }
}
