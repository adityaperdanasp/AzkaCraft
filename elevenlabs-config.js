// AzkaSocial — ElevenLabs voice configuration
//
// HOW TO ADD YOUR FREE API KEY:
//   1. Go to https://elevenlabs.io and sign up for a free account.
//   2. Open your profile (top right) → "API Keys" → copy your key.
//   3. Paste it below, replacing the empty string between the quotes.
//   4. Save this file. voice.js will automatically use ElevenLabs once a
//      key is present, and will fall back to the browser's built-in voice
//      (SpeechSynthesis) if the key is missing, invalid, or the free-tier
//      quota runs out.
//
// This file is intentionally separate from voice.js so you never have to
// touch the game logic to update your key.

window.ELEVENLABS_CONFIG = {
  // Paste your ElevenLabs API key here, e.g. "sk_abcdef1234567890"
  apiKey: "",

  // A warm, friendly female voice. "Bella" (EXAVITQu4vr4xnSDxMaL) is a good
  // free-tier default; browse https://elevenlabs.io/app/voice-library for others.
  voiceId: "EXAVITQu4vr4xnSDxMaL",

  // Multilingual model works well for English + Indonesian mixes.
  modelId: "eleven_multilingual_v2"
};
