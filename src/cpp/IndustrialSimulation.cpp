#include <emscripten/bind.h>
#include <vector>
#include <string>
#include <cmath>

using namespace emscripten;

// Simulates a large-scale industrial factory network processing raw materials into finished goods.
// This is mathematically heavy, running thousands of iterations to simulate macro-economic scaling.
class IndustrialSimulation {
private:
    double currentEnergyDemandKW;
    double currentMaterialThroughputKg;
    double wasteHeatProducedKW;
    int numFactories;
    double efficiency;

public:
    IndustrialSimulation(int initialFactories, double baseEfficiency)
        : numFactories(initialFactories), efficiency(baseEfficiency) {
        currentEnergyDemandKW = 0.0;
        currentMaterialThroughputKg = 0.0;
        wasteHeatProducedKW = 0.0;
    }

    void simulateTick(int timeDeltaSeconds, double productionMultiplier) {
        // Reset accumulators
        currentEnergyDemandKW = 0.0;
        currentMaterialThroughputKg = 0.0;
        wasteHeatProducedKW = 0.0;

        // Computationally demanding loop simulating individual factory nodes
        // (In a real scenario, this might be hundreds of thousands of nodes with complex graphs)
        for (int i = 0; i < numFactories; i++) {
            // Complex non-linear scaling (dummy math for high CPU load)
            double loadFactor = std::sin(i * 0.01) * 0.2 + 0.8; // 0.6 to 1.0
            double energyBase = 500.0 * loadFactor * productionMultiplier; // Base kW per factory
            double materialBase = 200.0 * loadFactor * productionMultiplier; // Base kg processed per factory

            // Apply efficiency curve (diminishing returns)
            double actualEnergy = energyBase / (efficiency * std::log10(energyBase + 10.0));
            double heatLoss = actualEnergy * (1.0 - efficiency);

            currentEnergyDemandKW += actualEnergy;
            currentMaterialThroughputKg += materialBase;
            wasteHeatProducedKW += heatLoss;
        }

        // Multiply by time delta to get absolute joules/kg if needed by the TS caller
    }

    void expandInfrastructure(int newFactories) {
        numFactories += newFactories;
        // As network grows, overall efficiency slightly drops due to logistics
        efficiency = std::max(0.1, efficiency - (newFactories * 0.0001));
    }

    double getEnergyDemandKW() const { return currentEnergyDemandKW; }
    double getMaterialThroughputKg() const { return currentMaterialThroughputKg; }
    double getWasteHeatKW() const { return wasteHeatProducedKW; }
    int getFactoryCount() const { return numFactories; }
    double getEfficiency() const { return efficiency; }
};

// Expose the C++ class to JavaScript via Embind
EMSCRIPTEN_BINDINGS(industrial_module) {
    class_<IndustrialSimulation>("IndustrialSimulation")
        .constructor<int, double>()
        .function("simulateTick", &IndustrialSimulation::simulateTick)
        .function("expandInfrastructure", &IndustrialSimulation::expandInfrastructure)
        .function("getEnergyDemandKW", &IndustrialSimulation::getEnergyDemandKW)
        .function("getMaterialThroughputKg", &IndustrialSimulation::getMaterialThroughputKg)
        .function("getWasteHeatKW", &IndustrialSimulation::getWasteHeatKW)
        .function("getFactoryCount", &IndustrialSimulation::getFactoryCount)
        .function("getEfficiency", &IndustrialSimulation::getEfficiency)
        ;
}
