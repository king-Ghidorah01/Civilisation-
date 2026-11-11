export class WasmLoader {
    private static instance: any = null;

    public static async getModule(): Promise<any> {
        if (this.instance) return this.instance;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/wasm/industry_sim.js';
            script.onload = () => {
                // The emscripten generated JS creates a global Module object
                // If it's an ES6 module we could import, but by default it adds a factory function
                if (typeof (window as any).IndustrialSimModule === 'function') {
                    (window as any).IndustrialSimModule().then((mod: any) => {
                        this.instance = mod;
                        resolve(mod);
                    }).catch(reject);
                } else {
                    reject("IndustrialSimModule not found on window");
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}
