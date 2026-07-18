// AzkaCraft — voice encouragement
// Primary: ElevenLabs API (warm natural female voice). Falls back automatically
// to the browser SpeechSynthesis API if ElevenLabs is unavailable, errors, or
// the free-tier quota is exhausted.

const PRAISE_PHRASES = [
  "Amazing job, Azka! You got it!",
  "Wow Azka, that's exactly right!",
  "Azka, you're a superstar today!",
  "Yes! Azka nailed it!",
  "Fantastic work, Azka!",
  "Azka, your brain is on fire — great job!",
  "Perfect, Azka! Keep it up!",
  "You're on a roll, Azka!",
  "Brilliant, Azka! That's correct!",
  "Way to go, Azka! You're learning so fast!",
  "Azka, that was awesome!",
  "Incredible, Azka! You really know this!"
];

const ENCOURAGE_PHRASES = [
  (correct) => `Nice try, Azka! The right answer was ${correct}. You'll get it next time!`,
  (correct) => `Almost there, Azka! It's actually ${correct} — great effort!`,
  (correct) => `Good try, Azka! Remember, the answer is ${correct}. You're learning!`,
  (correct) => `That's okay, Azka! The correct answer is ${correct}. Keep going, you're doing great!`,
  (correct) => `Close one, Azka! It was ${correct} this time — you'll shine on the next one!`,
  (correct) => `No worries, Azka! The answer is ${correct}. Mistakes help us learn!`,
  (correct) => `Azka, don't worry! It's ${correct} — you're getting stronger every day!`,
  (correct) => `Almost, Azka! The answer was ${correct}. Try the next one with me!`,
  (correct) => `Azka, that's a tricky one! The answer is ${correct}. You're doing wonderfully!`,
  (correct) => `Keep your chin up, Azka! It's ${correct} — I believe in you!`,
  (correct) => `Good thinking, Azka! The correct one is ${correct}. Onward!`,
  (correct) => `Azka, learning means trying! The answer is ${correct}. Let's keep exploring!`
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function speakWithElevenLabs(text) {
  const cfg = window.ELEVENLABS_CONFIG;
  if (!cfg || !cfg.apiKey) return false;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": cfg.apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: cfg.modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (!response.ok) return false;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
    audio.onended = () => URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.warn("ElevenLabs voice failed, falling back to browser voice:", err);
    return false;
  }
}

function speakWithBrowser(text) {
  if (!("speechSynthesis" in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 1.15;
  utter.rate = 1.0;
  utter.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v =>
    /female|samantha|victoria|karen|moira|tessa|zira/i.test(v.name)
  );
  if (femaleVoice) utter.voice = femaleVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

async function speak(text) {
  const usedElevenLabs = await speakWithElevenLabs(text);
  if (!usedElevenLabs) speakWithBrowser(text);
}

function speakPraise() {
  const phrase = pickRandom(PRAISE_PHRASES);
  speak(phrase);
  return phrase;
}

function speakEncouragement(correctAnswer) {
  const phrase = pickRandom(ENCOURAGE_PHRASES)(correctAnswer);
  speak(phrase);
  return phrase;
}

function speakStory(text) {
  speak(text);
}

window.AzkaVoice = { speak, speakPraise, speakEncouragement, speakStory };
