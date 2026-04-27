import { MATERIAL_DB, calculateCarbon, findClosestMaterialKey } from './utils.js';
import { API_CONFIG } from './config.js';

const API_KEY = API_CONFIG.GEMINI_API_KEY;

document.getElementById('scan-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if we are on a supported site
    if (!tab.url.includes("amazon") && !tab.url.includes("flipkart") && !tab.url.includes("myntra")) {
        document.getElementById('status').innerText = "Please go to a product page.";
        return;
    }

    document.getElementById('status').innerText = "AI is analyzing...";

    // Request data from content script
    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, async (response) => {
        if (!response || !response.data) {
            document.getElementById('status').innerText = "Couldn't find product details.";
            return;
        }

        // Call Gemini API
        const aiResponse = await callGemini(response.data);
        displayResult(aiResponse);
    });
});

async function callGemini(text) {
    // UPDATED: Using Gemini 3 Flash for maximum speed/reliability in 2026
    const MODEL_NAME = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Analyze this product description. 
                            Extract the material and weight. 
                            If the weight is not listed, ESTIMATE it based on the product type (e.g., a pool float is ~1-2kg).
                            If origin is unknown, assume 2000km.

                            Return ONLY JSON: 
                            {
                            "material_key": "Should match one of: [textile_cotton, plastic_pvc, metal_aluminum...]",
                            "weight_kg": 1.5, 
                            "origin_distance_km": 2000
                            }

                            Text: ${text}`
                }]
            }]
        })
    });

    if (!res.ok) {
        const errorDetails = await res.json();
        console.error("API Error:", errorDetails);
        throw new Error(`API Error: ${errorDetails.error.message}`);
    }

    const json = await res.json();

    try {
        let resultText = json.candidates[0].content.parts[0].text;

        // CLEANUP: Remove potential markdown code blocks (```json ... ```)
        const cleanJson = resultText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback if AI output is messy
        return { material_key: "textile_avg", weight_kg: 0.5, origin_distance_km: 1000 };
    }
}

function displayResult(data) {
    const matchedKey = findClosestMaterialKey(data.material_key);
    const weight = data.weight_kg || 0.5;
    const distance = data.origin_distance_km || 1000;

    const factor = MATERIAL_DB[matchedKey] || MATERIAL_DB.plastic_avg;
    const total = parseFloat(calculateCarbon(weight, matchedKey, distance));

    // UI Logic: Impact Grade (A-F)
    // We'll base it on a simple scale: < 2kg is A, > 15kg is F
    let grade = "A";
    let color = "#27ae60"; // Green
    let percent = Math.min((total / 20) * 100, 100);

    if (total > 15) { grade = "F"; color = "#e74c3c"; }
    else if (total > 10) { grade = "D"; color = "#e67e22"; }
    else if (total > 5) { grade = "C"; color = "#f1c40f"; }
    else if (total > 2) { grade = "B"; color = "#2ecc71"; }

    // Update UI elements
    document.getElementById('status').classList.add('hidden');
    document.getElementById('result-area').classList.remove('hidden');

    document.getElementById('co2-value').innerText = total.toFixed(2);
    document.getElementById('impact-grade').innerText = grade;
    document.getElementById('impact-grade').style.background = color;

    const fill = document.getElementById('progress-fill');
    fill.style.width = percent + "%";
    fill.style.background = color;

    let detailText = `Calculated for ${weight}kg of ${matchedKey.split('_').pop().toUpperCase()}.`;
    if (!data.weight_kg) detailText += " (Weight estimated by AI)";

    document.getElementById('details').innerText = detailText;
}