# AzkaCraft — Storybook Language & Arts Quest

A storybook-themed quiz game built for Azka (Grade 4), covering grammar,
vocabulary, reading comprehension, creative writing, and basic art concepts.

## File structure

| File | Purpose |
|---|---|
| `index.html` | All screens (landing, multiplayer setup, quest map, sticker book, game, brain rest). Structure only. |
| `style.css` | All styling — Colorful/Pastel themes, Fredoka font, storybook bookshelf UI, page-flip animation, sticker book, Brain Rest cat. |
| `script.js` | Core game logic: theme toggle, chapter progression, localStorage saves, question rendering + rotation, answer correction timing, Brain Rest timer. |
| `firebase.js` | Firebase config + Multiplayer sync (pairing codes, realtime progress). Only loaded/used in Multiplayer mode — Solo mode never touches it. |
| `qrcode.js` | QR code generation (for hosting) and camera-based QR scanning (for joining). |
| `voice.js` | ElevenLabs text-to-speech with automatic fallback to the browser's SpeechSynthesis API. Praise/encouragement phrase banks live here. |
| `elevenlabs-config.js` | Paste your free ElevenLabs API key here (see below). |
| `questions.json` | The question bank, organized by chapter. Placeholder content for now. |
| `manifest.json` | Web app manifest for "Add to Home Screen". |
| `icons/` | Real generated app icons (192×192, 512×512, apple-touch-icon) + the source SVG they were rendered from. |

## Solo Mode is fully standalone

Solo Mode never calls `firebase.js`, never needs a network connection to a
pairing partner, and never blocks on anything but a local `fetch` of
`questions.json`. All progress (unlocked chapters, stars, XP, stickers) is
saved to `localStorage` under the key `azkacraft-progress`. You can play
Solo entirely offline after the first load (aside from optional ElevenLabs
voice calls, which gracefully fall back to the on-device browser voice).

## Question bank structure (`questions.json`)

```json
{
  "chapters": [
    {
      "id": 1,
      "title": "Nouns & Naming Words",
      "topic": "Grammar",
      "snippet": "A short 1-2 sentence fun fact shown + spoken before each question.",
      "stickerId": "sticker-noun",
      "questions": [ /* see types below */ ]
    }
  ]
}
```

Each question has a `"type"` field. Supported types and their shape:

- **`mc`** — `{ type, prompt, options: [...], answer }`
- **`fill`** — `{ type, prompt, answer }` (typed answer, matched case-insensitively, trimmed)
- **`match`** / **`craft-match`** — `{ type, prompt, pairs: [{ left, right }, ...] }`
- **`flashcard`** — `{ type, word, definition, example }` (self-check, no wrong state)
- **`sentence-builder`** — `{ type, prompt, words: [...], answer }` (words are shuffled and shown as tappable chips)

To add real content: open `questions.json`, find the chapter by `id`, and
replace/expand its `questions` array. Chapters run in `id` order and unlock
sequentially as each is completed. The game automatically mixes question
types so the same type never repeats twice in a row — you don't need to
order them yourself.

## Adding your free ElevenLabs API key

1. Sign up free at [elevenlabs.io](https://elevenlabs.io).
2. Profile menu → **API Keys** → copy your key.
3. Open `elevenlabs-config.js` and paste it into `apiKey: ""`.
4. Save. That's it — `voice.js` automatically uses ElevenLabs when a key is
   present, and silently falls back to the browser's built-in voice if the
   key is missing, a request fails, or the free-tier quota runs out. No
   other file needs to change.

## Multiplayer / QR join

1. One player picks **Multiplayer Quest → Host a Game**, chooses a chapter,
   and taps **Create Game**. This writes a game record to Firebase Realtime
   Database under `/games/<6-char-code>` and shows the code + a QR code.
2. The other player picks **Multiplayer Quest → Join a Game** and either
   types the 6-character code or taps **Scan QR Instead** to use their
   camera (via `qrcode.js` + the `jsQR` library).
3. Once the guest joins, both devices start the same chapter's questions.
   Each answer updates that player's progress in Firebase
   (`games/<code>/players/<role>`), so you could extend the UI to show a
   live opponent progress bar by reading that same path.
4. **Multiplayer requires a Firebase project** — see the setup comment at
   the top of `firebase.js`. Until you paste in real Firebase config values,
   Multiplayer will show a friendly alert instead of crashing; Solo Mode is
   completely unaffected either way.

## Brain Rest

After finishing every question in a chapter, the game shows a **Brain
Rest** screen: a wiggling cat animation, "Brain Rest!" text in Fredoka,
and a 10-second countdown before automatically returning to the Quest Map.
A **Skip ▶** button lets Azka continue immediately.

## Answer timing (as specified)

- ✅ Correct answer (any question type): green toast + praise phrase + speech, **1.5s** before the next question.
- ❌ Multiple Choice wrong: correct option highlighted green for **5s**, plus a warm phrase naming Azka.
- ❌ Fill-in-the-blank wrong: correct answer shown under the input for **5s**, plus a warm phrase.
- ❌ Matching wrong: correct answer shown on the incorrect row for **7s**, plus a warm phrase.
- Flashcard: self-check only — no wrong state, no special timing (advances 1.5s after "Got it!").

The encouragement toast is a **fixed top banner** (`.encourage-toast` in
`style.css`), positioned outside the question/answer card at all times, so
it never overlaps the correct-answer correction or any interactive
buttons/inputs.

## App icon / "Add to Home Screen"

`icons/icon-192.png`, `icons/icon-512.png`, and `icons/apple-touch-icon.png`
are real rendered PNGs (generated from `icons/icon-source.svg`, a
storybook-themed mascot holding a paintbrush), referenced by `manifest.json`
and the `<link>`/`<meta>` tags in `index.html`. To install on a phone:
open the deployed URL in Safari (iOS) or Chrome (Android), then use
**Share → Add to Home Screen** (iOS) or the **Install app** menu prompt
(Android/Chrome).

## Next step

Real chapter content (generated from a source PDF, not copy-pasted, with a
larger shuffleable pool per chapter) will be added to `questions.json` in a
follow-up pass — the schema above is what to target.
