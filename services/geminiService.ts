
import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData } from '../utils/audioUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
  sampleRate: 24000,
});

export const generateSpeech = async (
  prompt: string, 
  voice: string, 
  pitch: number, 
  speakingRate: number
): Promise<AudioBuffer | null> => {
  try {
    const speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: string } };
      pitch?: number;
      speakingRate?: number;
    } = {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: voice },
      },
    };

    // The API may reject requests that explicitly set default values.
    // Only include pitch and speakingRate if they are non-default.
    if (pitch !== 0.0) {
      speechConfig.pitch = pitch;
    }
    if (speakingRate !== 1.0) {
      speechConfig.speakingRate = speakingRate;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: speechConfig,
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error("No audio data found in the response.");
      return null;
    }
    
    const audioBytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(
      audioBytes,
      audioContext,
      24000,
      1,
    );
    
    return audioBuffer;
  } catch (error) {
    console.error("Error generating speech:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("INVALID_ARGUMENT")) {
         throw new Error("The API rejected the request due to an invalid argument. Please check the voice, pitch, or speed settings.");
    }
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
