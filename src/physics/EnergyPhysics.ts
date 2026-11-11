export class EnergyPhysics {
    /**
     * Calculates kinetic energy
     * E = 0.5 * m * v^2
     * @param mass_kg Mass in kilograms
     * @param velocity_m_s Velocity in meters per second
     * @returns Kinetic Energy in Joules
     */
    public static kineticEnergy(mass_kg: number, velocity_m_s: number): number {
        return 0.5 * mass_kg * Math.pow(velocity_m_s, 2);
    }

    /**
     * Converts Terawatts to Joules per second
     */
    public static terawattsToJoules(tw: number): number {
        return tw * 1e12;
    }
}
