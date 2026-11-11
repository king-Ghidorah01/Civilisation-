export class ThermalPhysics {
    public static STEFAN_BOLTZMANN_CONSTANT = 5.670374419e-8; // W⋅m−2⋅K−4

    /**
     * Calculates required radiator area using Stefan-Boltzmann law
     * P = A * e * sigma * T^4
     * A = P / (e * sigma * T^4)
     * @param power_w Waste heat power in Watts
     * @param temp_k Operating temperature in Kelvin
     * @param emissivity Emissivity (0 to 1, default 1 for perfect blackbody)
     * @returns Area in square meters
     */
    public static calculateRadiatorArea(power_w: number, temp_k: number, emissivity: number = 1.0): number {
        const denom = emissivity * this.STEFAN_BOLTZMANN_CONSTANT * Math.pow(temp_k, 4);
        return power_w / denom;
    }
}
