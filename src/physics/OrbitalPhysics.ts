export class OrbitalPhysics {
    public static GRAVITATIONAL_CONSTANT = 6.67430e-11; // m^3 kg^-1 s^-2

    /**
     * Calculates orbital velocity for circular orbit
     * v = sqrt(G * M / r)
     * @param central_mass_kg Mass of the body being orbited
     * @param radius_m Distance from center of mass
     * @returns Velocity in m/s
     */
    public static circularOrbitalVelocity(central_mass_kg: number, radius_m: number): number {
        return Math.sqrt((this.GRAVITATIONAL_CONSTANT * central_mass_kg) / radius_m);
    }

    /**
     * Calculates escape velocity
     * v_e = sqrt(2 * G * M / r)
     */
    public static escapeVelocity(central_mass_kg: number, radius_m: number): number {
        return Math.sqrt((2 * this.GRAVITATIONAL_CONSTANT * central_mass_kg) / radius_m);
    }
}
