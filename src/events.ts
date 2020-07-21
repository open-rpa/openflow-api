export class CustomEventEmitter {
    private events: any[][] = [];
    private maxListeners: number = 250;
    on(event: string, callback: any) {
        if (!(this.events[event] instanceof Array)) {
            this.events[event] = [];
        }
        const exists = this.events[event].filter(item => item === callback);
        if (exists.length === 0) return this.events[event].push(callback) - 1;
    }
    emit(event: string, data: any = null) {
        const callbacks = this.events[event];
        if (callbacks) {
            callbacks.forEach((callback) => {
                if (callback instanceof Function) {
                    callback(data);
                }
            });
        }
    }
    removeListener(event: string, callback: any) {
        if (!(this.events[event] instanceof Array)) {
            this.events[event] = [];
        }
        this.events[event] = this.events[event].filter(item => item !== callback);
    }
    removeAllListeners() {
        this.events = [];
    }
    setMaxListeners(max: number) {
        this.maxListeners = max;
    }
}