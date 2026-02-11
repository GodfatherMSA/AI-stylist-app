# AI-Powered Personal Stylist (Trendyol Case Study)

> **"Turning single purchases into full outfits with Generative AI."**

This project is a Proof of Concept (PoC) mobile application that acts as a **Personal AI Stylist** for e-commerce platforms. Using **Google Gemini Vision AI**, it analyzes product images (from gallery or URL) and generates real-time, style-aware outfit recommendations to increase the **Average Order Value (AOV)** and improve user experience.

## Key Features

* **Visual Analysis:** Users can upload a photo of any clothing item. The Vision AI understands fabric, color, cut, and style.
* **Link Integration:** Directly analyzes product links (demonstrated with Trendyol.com links).
* **AI Stylist Engine:** Generates culturally and stylistically relevant combinations (Shoes, Accessories, Outerwear) based on the analyzed item.
* **Smart Cart:** "Complete the Look" buttons in the cart redirect users back to the marketplace to purchase the recommended items (Cross-Selling).
* **Validation:** Detects gender/category mismatches (e.g., warns if a male user uploads a dress).

## Tech Stack

* **Mobile:** React Native (Expo), TypeScript
* **Backend:** Python (FastAPI)
* **AI Core:** Google Gemini 1.5 Flash (Vision & Text Generation)
* **Networking:** Axios, BeautifulSoup (for metadata extraction)

## Use Case & Business Value

In a real-world scenario (like Trendyol, Zalando, or ASOS), this module solves the "What should I wear with this?" problem:
1.  **Increases AOV:** Encourages users to buy complementary items.
2.  **Reduces Returns:** Users visualize better combinations, leading to higher satisfaction.
3.  **Scalable:** Designed to work with event-driven architecture (analyzing new inventory automatically).

## Disclaimer

This project is developed for **educational and demonstration purposes only**. Product images and data are used as placeholders to simulate real-world scenarios (sourced from public listings on Trendyol.com). No commercial intent or official affiliation.