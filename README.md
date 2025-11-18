
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

## Technology Stack & Architecture

This project is built with a modern frontend stack, focusing on efficiency, maintainability, and a great user experience.

-   **Frontend Framework: React**
    -   The UI is built as a single-page application using React.
    -   It uses modern React Hooks (`useState`, `useCallback`) for managing component state (like the input text, selected voice, and audio URL) and optimizing performance.

-   **AI Model: Google Gemini API**
    -   The core TTS functionality is powered by the `gemini-2.5-flash-preview-tts` model from Google.
    -   The official `@google/genai` JavaScript SDK is used to securely and efficiently communicate with the API from the browser.

-   **Styling: Tailwind CSS**
    -   A utility-first CSS framework used to rapidly build the custom, responsive design.
    -   The custom background gradient and component styles are defined directly in `index.html` and within the React components' `className` props.

-   **Language: TypeScript**
    -   The entire frontend codebase is written in TypeScript.
    -   This adds static typing to JavaScript, which helps prevent common bugs and makes the code more robust and easier to understand.

-   **Audio Processing: Web Audio API**
    -   The Gemini API returns raw audio data, not a standard file like an MP3.
    -   The browser's native Web Audio API is used to decode this raw audio data into a format that the browser can understand and play.
    -   Custom utility functions in `utils/audioUtils.ts` handle the process of converting the base64 response from the API into a playable WAV audio file (as a Blob).

---

## How It Works: The Code Flow

Understanding the flow of data from user input to audio output is key. Here’s a step-by-step breakdown:

1.  **User Interaction:**
    -   The user types text into the `<textarea>`, selects a voice from the dropdown, and adjusts the pitch/speed sliders.
    -   Each action updates the corresponding state variable in the `App.tsx` component (e.g., `text`, `selectedVoice`, `pitch`, `speed`).

2.  **Triggering Speech Generation:**
    -   The user clicks the "Generate Speech" button.
    -   This calls the `handleGenerateSpeech` function inside `App.tsx`. The app enters a `isLoading` state, showing a spinner.

3.  **Calling the Service Layer:**
    -   `handleGenerateSpeech` calls the `generateSpeech` function located in `services/geminiService.ts`.
    -   This is an important architectural choice: the UI component (`App.tsx`) is kept separate from the logic that talks to the external API. This "separation of concerns" makes the code cleaner.

4.  **Communicating with the Gemini API:**
    -   The `generateSpeech` service function constructs a request payload for the Gemini API.
    -   It includes the user's text, the chosen `voiceName`, and conditionally adds the `pitch` and `speakingRate` if they have been changed from their default values.
    -   It uses the `@google/genai` SDK to send the request to the `gemini-2.5-flash-preview-tts` model.

5.  **Handling the API Response:**
    -   The Gemini API responds with a JSON object containing the audio data encoded as a **base64 string**.
    -   The service function extracts this base64 string from the response.

6.  **Decoding and Converting Audio:**
    -   The base64 string is passed to the `decode` function in `utils/audioUtils.ts`, which turns it into a `Uint8Array` (raw binary data).
    -   This binary data is then passed to `decodeAudioData` to be converted into an `AudioBuffer` using the Web Audio API.
    -   Finally, `bufferToWav` converts the `AudioBuffer` into a standard WAV audio file, packaged as a `Blob`. A Blob is essentially a file-like object in the browser's memory.

7.  **Playing the Audio:**
    -   The WAV `Blob` is returned to the `App.tsx` component.
    -   `URL.createObjectURL(wavBlob)` creates a temporary, local URL for the Blob.
    -   This URL is set as the `src` for the `<audio>` element, making it playable. The UI updates to show the audio player, and the loading state is turned off.

---

## Potential Interview Questions

**Q: What was the most challenging part of building this application?**
**A:** "The most challenging part was handling the audio data from the Gemini API. The API doesn't return a simple MP3 file; it provides raw PCM audio data encoded in base64. I had to implement a multi-step process on the client-side: first, decode the base64 string into binary data, then use the Web Audio API to process that raw data into an `AudioBuffer`, and finally, convert that buffer into a standard WAV file format (as a Blob) that HTML audio players can actually play. This required a good understanding of browser audio APIs and data manipulation."

**Q: Why did you choose this specific technology stack (React, Tailwind, TypeScript)?**
**A:** "I chose **React** because its component-based architecture is perfect for building an interactive and manageable UI. **TypeScript** was chosen to ensure the code is robust and less prone to errors, which is crucial when dealing with complex API responses. For styling, **Tailwind CSS** allowed me to rapidly build a modern, custom, and fully responsive design without writing a lot of custom CSS from scratch."

**Q: How did you structure your code to be maintainable?**
**A:** "I focused on the principle of 'separation of concerns'. The main UI logic is in `App.tsx`. All communication with the Gemini API is isolated in its own service file, `services/geminiService.ts`. All complex audio processing logic is in `utils/audioUtils.ts`. Reusable pieces, like icons, are in a `components` directory. This structure makes the code easy to read, debug, and expand upon in the future."

**Q: If you had more time, what features would you add?**
**A:** "I would add a few features to enhance the user experience. First, I'd implement **audio streaming** so the user can start hearing the audio as it's being generated instead of waiting for the full file. Second, I'd add a **download button** to allow users to save the generated WAV file. Finally, I would explore adding more advanced audio effects or even the ability for users to create and save their own custom voice presets."
