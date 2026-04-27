/**
 * CarbonLens - Utility Database and Calculation Engine
 * Values are primarily sourced from user-provided datasets (ICE, ADEME, etc.)
 */

export const MATERIAL_DB = {
    // 1. TEXTILES & FABRICS
    "textile_cotton": 8.3,
    "textile_organic_cotton": 1.6,
    "textile_acrylic": 11.53,
    "textile_linen": 4.5,
    "textile_nylon": 7.31,
    "textile_silk": 7.63,
    "textile_wool": 13.89,
    "textile_polyester": 6.4,
    "textile_viscose": 5.5,
    "textile_denim": 10.5,
    "textile_avg": 8.0,

    // 2. PLASTICS & POLYMERS
    "plastic_hdpe": 6.262,
    "plastic_ldpe": 6.212,
    "plastic_pp": 6.042,
    "plastic_pvc": 6.212,
    "plastic_ps": 7.392,
    "plastic_pet": 7.082,
    "plastic_abs": 6.5,
    "plastic_polycarbonate": 7.2,
    "plastic_pu": 5.0,
    "plastic_avg": 6.5,

    // 3. WOOD & NATURAL MATERIALS
    "wood_hardwood": 1.8,
    "wood_softwood": 1.2,
    "wood_bamboo": 24.2, // Process-heavy value
    "wood_plywood": 0.267,
    "wood_mdf": 0.75,
    "wood_cork": 0.15,
    "wood_cardboard": 0.94,
    "wood_avg": 5.0,

    // 4. METALS & ALLOYS
    "metal_steel": 1.85,
    "metal_stainless_steel": 6.15,
    "metal_aluminum": 20.0,
    "metal_copper": 1.9,
    "metal_iron": 2.0,
    "metal_zinc": 0.3,
    "metal_cast_iron": 0.8685,
    "metal_avg": 4.5,

    // 5. GLASS & CERAMICS
    "glass_general": 0.089,
    "glass_toughened": 1.1,
    "ceramic_general": 0.063,
    "glass_avg": 0.1,
    "ceramic_avg": 0.07,

    // 6. RUBBER & FOAMS
    "rubber_natural": 1.5,
    "rubber_synthetic": 3.5,
    "foam_pu": 4.2,
    "foam_eva": 3.8,

    // 9. STONE & MINERALS
    "stone_marble": 1.2,
    "stone_granite": 1.5,
    "stone_quartz": 2.1,

    // 10. OTHER
    "leather_natural": 35.0, // High impact
    "leather_faux": 7.5,
    "electronics_general": 35.0 // Chip/battery intensity fallback
};

export const TRANSPORT_FACTORS = {
    "air": 0.00442, // kg CO2e per kg per km
    "road": 0.00021, // kg CO2e per kg per km
    "sea": 0.00003   // kg CO2e per kg per km
};

/**
 * Calculates total CO2 footprint
 * Formula: (Weight * Material Emission) + (Weight * Distance * Transport Mode)
 */
export function calculateCarbon(weightKg, materialKey, distanceKm, mode = "air") {
    // 1. Get material factor (default to textile_avg if not found)
    const materialFactor = MATERIAL_DB[materialKey] || MATERIAL_DB.textile_avg;
    
    // 2. Calculate material base
    const materialEmissions = weightKg * materialFactor;
    
    // 3. Calculate transport impact
    const transportFactor = TRANSPORT_FACTORS[mode] || TRANSPORT_FACTORS.air;
    const transportEmissions = weightKg * distanceKm * transportFactor;
    
    // 4. Return total formatted to 2 decimal places
    return (materialEmissions + transportEmissions).toFixed(2);
}

/**
 * Helper to normalize Gemini's output to match our keys
 */
export function findClosestMaterialKey(aiOutput) {
    const key = aiOutput.toLowerCase().trim();
    if (MATERIAL_DB[key]) return key;
    
    // Simple fallback logic: check if the string is contained in any key
    const allKeys = Object.keys(MATERIAL_DB);
    const match = allKeys.find(k => k.includes(key) || key.includes(k));
    
    return match || "textile_avg";
}