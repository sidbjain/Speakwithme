import React, { useState, useCallback } from 'react';
import { generateSpeech } from './services/geminiService';
import { bufferToWav } from './utils/audioUtils';
import { VOICES } from './constants';
import { SpeakWithMeIcon } from './components/icons/SpeakWithMeIcon';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const MAX_TEXT_LENGTH = 1000;
  const [text, setText] = useState<string>('Hello! Welcome to SpeakWithMe. Type something here and click generate to hear it spoken.');
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].value);
  const [pitch, setPitch] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerateSpeech = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate speech.');
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Please limit your text to ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const audioBuffer = await generateSpeech(text, selectedVoice, pitch, speed);
      if (audioBuffer) {
        const wavBlob = bufferToWav(audioBuffer);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
      } else {
        throw new Error('Failed to generate audio. The response was empty.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, pitch, speed]);

  return (
    <div className="min-h-screen bg-transparent text-slate-200 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-2xl mx-auto bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-6 md:p-10 space-y-8 border border-slate-700/80">
        <header className="text-center space-y-3">
          <div className="inline-block p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
            <SpeakWithMeIcon className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            SpeakWithMe
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Bring your words to life. Instantly create natural-sounding audio with the power of SpeakWithMe.
          </p>
        </header>

        <main className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="text-input" className="block text-sm font-medium text-slate-400">
              Your Text
            </label>
            <div className="relative">
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full h-40 p-4 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-none placeholder:text-slate-500"
                disabled={isLoading}
                maxLength={MAX_TEXT_LENGTH}
              />
              <div className="absolute bottom-2 right-3 text-xs text-slate-500">
                {text.length} / {MAX_TEXT_LENGTH}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="voice-select" className="block text-sm font-medium text-slate-400">
              Select Voice
            </label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200"
              disabled={isLoading}
            >
              {VOICES.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="pitch-slider" className="block text-sm font-medium text-slate-400">
                Pitch
              </label>
              <span className="text-sm text-slate-400 font-mono bg-slate-800/60 px-2 py-1 rounded-md">{pitch.toFixed(1)}</span>
            </div>
            <input
              id="pitch-slider"
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label htmlFor="speed-slider" className="block text-sm font-medium text-slate-400">
                  Speed
                </label>
                <span className="text-sm text-slate-400 font-mono bg-slate-800/60 px-2 py-1 rounded-md">{speed.toFixed(2)}x</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min="0.25"
              max="4.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <button
            onClick={handleGenerateSpeech}
            disabled={isLoading || !text.trim()}
            className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              'Generate Speech'
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {audioUrl && (
            <div className="space-y-3 pt-4 animate-fade-in">
              <div className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700 rounded-xl">
                <audio controls src={audioUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </main>
      </div>
       <footer className="text-center pt-8 text-slate-500 text-sm">
        <p>Powered by Sidharth Jain</p>
      </footer>
    </div>
  );
};

export default App;
