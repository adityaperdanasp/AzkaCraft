// AzkaCraft — Firebase config and Multiplayer sync logic.
// This file is ONLY loaded/used when the player picks Multiplayer mode.
// Solo mode never touches this file or the network — see script.js.
//
// SETUP:
//   1. Go to https://console.firebase.google.com → create a project (free).
//   2. Build → Realtime Database → Create Database (pick a region close to you).
//   3. Project settings → General → "Your apps" → add a Web app → copy the config.
//   4. Paste the config values below.
//   5. In Realtime Database → Rules, scope access to the /games path, e.g.:
//        { "rules": { "games": { "$code": { ".read": true, ".write": true } } } }

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://PASTE_YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "PASTE_YOUR_PROJECT",
  storageBucket: "PASTE_YOUR_PROJECT.firebasestorage.app",
  appId: "PASTE_YOUR_APP_ID"
};

let db = null;
function ensureFirebase() {
  if (db) return db;
  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded.");
    return null;
  }
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  return db;
}

function makePairingCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createGame(chapterId, questions) {
  const database = ensureFirebase();
  if (!database) return null;
  const code = makePairingCode();
  await database.ref("games/" + code).set({
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    chapterId,
    questionCount: questions.length,
    status: "waiting",
    players: {
      host: { name: "Azka", progress: 0, score: 0 }
    }
  });
  return code;
}

async function joinGame(code, playerName) {
  const database = ensureFirebase();
  if (!database) return false;
  const snap = await database.ref("games/" + code).get();
  if (!snap.exists()) return false;
  await database.ref(`games/${code}/players/guest`).set({ name: playerName, progress: 0, score: 0 });
  await database.ref(`games/${code}/status`).set("playing");
  return true;
}

function listenToGame(code, callback) {
  const database = ensureFirebase();
  if (!database) return () => {};
  const gameRef = database.ref("games/" + code);
  gameRef.on("value", snap => callback(snap.val()));
  return () => gameRef.off("value");
}

async function updateProgress(code, role, progress, score) {
  const database = ensureFirebase();
  if (!database) return;
  await database.ref(`games/${code}/players/${role}`).update({ progress, score });
}

async function finishGame(code, winnerRole) {
  const database = ensureFirebase();
  if (!database) return;
  await database.ref(`games/${code}/status`).set("finished");
  await database.ref(`games/${code}/winner`).set(winnerRole);
}

window.AzkaFirebase = {
  createGame,
  joinGame,
  listenToGame,
  updateProgress,
  finishGame,
  makePairingCode
};
