# Lost Starways

An old-school Commodore 64-style game collection with a shared leaderboard.
The app opens on a hub of game cards — Lost Starways playable today, more
games on the way — and every completed run posts its score to a server-side
TOP SCOUTS board that all players see. The game itself is a text adventure
across strange worlds with a parser that takes two-word commands, all in the
look and sound of a 1982 home computer: a palette-true pixel renderer for the
location pictures and WebAudio "SID-ish" beeps. No sound files, no external
assets.

## How it works

- **Hub first.** `/` is the hub: game cards driven by `public/games.json`
  plus the TOP SCOUTS leaderboard. The game lives at `/play`. Add a game by
  adding a registry entry and a page at its `path`.
- **Single-file game.** The whole game (CSS, JavaScript, map data) lives in
  `public/index.html`; the shared pixel fonts are in `public/fonts.css`.
- **Saves in your browser.** Progress is kept in localStorage, wrapped in
  try/catch so the game still runs where storage is blocked. You can also
  copy a save code between devices (type `LOAD` followed by the code).
- **Scores on the server.** When a run is COMPLETED, the game posts the
  session score to `/api/scores`. The server keeps the best completed score
  per player per game (a higher rerun replaces it, a lower one changes
  nothing) in the `game_scores` Postgres table, keyed by the platform-issued
  user id with the Homeroom username as the display name. `/api/leaderboard`
  returns the top 10 by total (the sum of per-game bests) plus the viewer's
  own rank.
- **Community lands.** Type `MODS` in the game to paste a map pack (JSON)
  and add your own land to the Starways. Packs are data only — they can't
  run code — and are validated before install.

## Quick start

- Pick a game on the hub and press PLAY. In the game, press RETURN at the
  title screen to start, `HELP` lists the verbs, `TAB` or `I` shows your
  inventory, `HUB` returns to the menu.
