# Lost Starways

An old-school Commodore 64-style text adventure. Seven strange worlds, a
ship in pieces, and a parser that takes two-word commands — all in one
self-contained HTML file with the look and sound of a 1982 home computer:
a palette-true pixel renderer for the location pictures and WebAudio
"SID-ish" beeps. No sound files, no external assets, no server-side state.

## How it works

- **Single file.** The whole game (CSS, JavaScript, embedded fonts and the
  map data) lives in `public/index.html`. `server.js` only serves it and
  verifies the platform-issued user token.
- **Saves in your browser.** Progress is kept in localStorage, wrapped in
  try/catch so the game still runs where storage is blocked. You can also
  copy a save code between devices (type `LOAD` followed by the code).
- **Community lands.** Type `MODS` in the game to paste a map pack (JSON)
  and add your own land to the Starways. Packs are data only — they can't
  run code — and are validated before install.

## Quick start

- Press RETURN at the title screen to start, `HELP` lists the verbs,
  `TAB` or `I` shows your inventory.
