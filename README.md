# SpeakWithMe - AI-Powered Text-to-Speech Application

SpeakWithMe is a modern, responsive web application that converts text into natural-sounding, lifelike speech using Google's powerful Gemini API. It provides a clean, intuitive interface for users to generate audio with various voice options and customizations.

## Core Features

- **High-Quality Text-to-Speech (TTS):** Leverages the `gemini-2.5-flash-preview-tts` model to produce clear and natural-sounding audio.
- **Voice Variety:** Offers a curated list of male and female voices with different characteristics, including several with Indian accents.
- **Speech Customization:** Users can fine-tune the audio output by adjusting the **pitch** and **speaking rate** (speed) using intuitive sliders.
- **Modern & Responsive UI:** A sleek, dark-themed interface built with Tailwind CSS that looks great on both desktop and mobile devices. The design features a blurred glass effect and vibrant cyan accents for a futuristic feel.
- **Real-time Audio Playback:** Generated audio is immediately available for playback in the browser via an HTML5 `<audio>` player.
- **User-Friendly Experience:** Includes a character counter, loading indicators, and clear error messaging to guide the user.

---

## Build & Deployment for GitHub Pages

This project is set up as a standard Vite application and requires a build step before it can be deployed to a static hosting service like GitHub Pages.

### Step 1: Install Dependencies

Before you can build the project, you need to install all the required libraries listed in `package.json`. Open your terminal in the project's root directory and run:

```bash
npm install
```

### Step 2: Build the Application

This is the most important step. The following command will compile all the TypeScript/TSX code, process the CSS, and bundle everything into a `dist` folder with optimized, static files that are ready for production.

```bash
npm run build
```

After this command finishes, you will see a new `dist` folder in your project root.

### Step 3: Deploy to GitHub Pages

Your GitHub Pages is configured to serve from the `/docs` folder in your `main` branch.

1.  **Delete the old `docs` folder** if it exists to ensure a clean deployment.
2.  **Rename the new `dist` folder to `docs`**.
3.  **Commit and push** the new `docs` folder to your GitHub repository.

```bash
# After running npm run build...
git add docs
git commit -m "Deploy new version to GitHub Pages"
git push origin main
```

After pushing, wait a minute or two for GitHub Pages to update, and your live site will be working correctly.

---

## Technology Stack & Architecture

-   **Frontend Framework: React**
-   **Build Tool: Vite**
-   **AI Model: Google Gemini API (`gemini-2.5-flash-preview-tts`)**
-   **Styling: Tailwind CSS**
-   **Language: TypeScript**
-   **Audio Processing: Web Audio API**

---

## How It Works: The Code Flow

1.  **User Interaction:** User inputs text and adjusts settings in `src/App.tsx`.
2.  **Triggering Speech Generation:** Clicking "Generate" calls `handleGenerateSpeech`.
3.  **Calling the Service Layer:** The handler calls the `generateSpeech` function in `src/services/geminiService.ts`.
4.  **Communicating with the Gemini API:** The service function sends a structured request to the Gemini API using the `@google/genai` SDK.
5.  **Handling the API Response:** The API returns audio data as a base64 string.
6.  **Decoding and Converting Audio:** The functions in `src/utils/audioUtils.ts` decode the base64 string and convert the raw data into a playable WAV Blob.
7.  **Playing the Audio:** A temporary URL is created from the Blob and assigned to the `<audio>` element's `src` attribute in `App.tsx`.

