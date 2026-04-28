CarbonLens
Real-time Sustainability Intelligence for Conscious E-commerce
CarbonLens is a Chrome Extension designed to bridge the "Information Gap" in online shopping. By leveraging Google Gemini 2.5 Flash, it transforms unstructured product descriptions from major e-commerce platforms into actionable carbon footprint data, empowering users to make climate-conscious decisions in seconds.

🎯 UN Sustainable Development Goals (SDGs)
CarbonLens is built in direct alignment with the following United Nations goals:

Goal 12: Responsible Consumption and Production (Target 12.8: Ensuring people everywhere have relevant information for sustainable development).

Goal 13: Climate Action (Target 13.3: Improving education and human capacity on climate change mitigation).

✨ Key Features
Zero-Input Analysis: No manual data entry required. The extension "reads" the page alongside you.

Gemini-Powered Extraction: Uses GenAI to identify material composition and weights from messy marketing text.

Scientific Precision: Maps materials to the ICE (Inventory of Carbon and Energy) database.

Visual Grading: Provides an intuitive A-F Sustainability Grade directly on the product page.

Localized Logic: Calibrated for Indian logistics and transportation emission factors.

🛠️ Tech Stack
AI Engine: Google Gemini 2.5 Flash (via Generative Language API)

Frontend: JavaScript (ES6+), HTML5, CSS3

Architecture: Chrome Extension Manifest V3

Communication: Secure HTTPS/REST API

🚀 Installation (Load Unpacked)
Since this is a developer prototype for the Solution Challenge, follow these steps to install:

Clone the Repository:

Bash
git clone https://github.com/priyanshi1202/carbonLens.git
Open Chrome Extensions:
Navigate to chrome://extensions/ in your browser.

Enable Developer Mode:
Toggle the switch in the top-right corner.

Load Unpacked:
Click the "Load unpacked" button and select the carbonlens folder from your local machine.

Pin the Extension:
Click the puzzle icon and pin CarbonLens for easy access.

📖 How to Use
Navigate to a product page on Amazon.in (e.g., a stainless steel knife or a polyester shirt).

Open the CarbonLens popup from the toolbar.

Click "Analyze Product".

View your carbon impact summary and sustainability grade!

🏗️ Architecture
CarbonLens uses a "Thin-Client" model. The extension scrapes the active tab's DOM and sends a secure HTTPS POST request to the Google Gemini API. The AI extracts the core material variables, which are then processed locally using our utils.js calculation engine to ensure sub-second latency and data privacy.
