# Lost Starways — notes for Claude Code

This app runs on **Homeroom**. If you're Claude Code
editing this repo, read the platform conventions before making
changes:

**Platform conventions (authoritative, always current):**
https://app.onhomeroom.com/claude.md

Fetch that URL at the start of each session — it's the single source
of truth for platform-wide behavior (auth model, `USERNODE_ENV`,
public/private tables, "don't `git push`", etc.). The hosted copy is
updated in place when platform rules change, so fetching it gives you
today's rules, not a stale snapshot.

When running inside Homeroom's dev-chat, those same conventions are
already injected into your system prompt, so the fetch is a no-op in
that path — but it's the right reflex when someone runs Claude Code
against this repo locally or from another harness.

## Connector permission prompts

This repo ships `.claude/settings.json`, which allows the **read-only**
Homeroom connector calls (`mcp__homeroom__get_*`,
`…__list_*`, `…__whoami`) so they stop prompting one at a time. Everything
that acts — filing a request, opening or advancing a proposal — still asks.
Claude Code applies those rules only after you accept the
workspace trust dialog, which lists them for review. See `.claude/README.md`
for the whole story, including what to do if you are still being prompted
(usually: your connector is registered under a different name than the rules
assume).

## Check that this checkout is current

You may be working in a fork of this app whose `main` is behind the app's
canonical repository, and nothing in the checkout says so: `git fetch origin`
compares the fork with itself. This matters before you **read** code to answer
a question about how the app behaves now, not only before you edit it.

The canonical repository is named in `.claude/homeroom-canonical-repo`. Check against
it, not against `origin`:

```sh
git fetch "$(cat .claude/homeroom-canonical-repo)" main
git merge-base --is-ancestor FETCH_HEAD HEAD && echo current || echo behind
```

`behind` means this checkout does not contain the canonical `main`. To answer
a question, read the canonical code instead (`git show FETCH_HEAD:<path>`,
`git grep <pattern> FETCH_HEAD`). To change code, start from the exact base
commit your Homeroom work order gives, and never merge or rebase onto the
canonical `main` yourself: which commit a change is diffed against decides
what the group votes on. With the Homeroom connector, `get_checkout_status`
answers the same question.

A session-start hook (`.claude/hooks/homeroom-freshness.sh`, see `.claude/README.md`) runs
this check for you and tells you when you are behind. It is silent offline, so
its silence is not proof the checkout is current. Inside Homeroom's dev-chat
the platform fixes the base commit, and none of this applies.

## App structure

The starter template (the Press! demo, `/api/press`, the `presses` table)
was removed when the real app was built; nothing from it remains. What the
app ships now:

- `/` is the **hub** (`public/hub.html`): game cards rendered from
  `public/games.json` plus the TOP SCOUTS leaderboard. `server.js` serves it
  with an explicit `app.get('/')` registered before `express.static`
  (static's default directory index would otherwise answer `/` with the game).
- `/play` is the **game** (`public/index.html`, plus `public/fonts.css` with
  the two embedded pixel fonts both pages share).
- `public/games.json` is the games registry and the single source for both
  the hub cards and which game ids `POST /api/scores` accepts.

## About Lost Starways

An old-school C64-style game collection. Today it is one text adventure
(Lost Starways: seven strange worlds, 21 ship parts, two-word parser
commands); the hub makes it a collection so more games can land without a
redesign — "Escape from Dracula" is the first placeholder card.

## App-specific conventions

- The C64 look is the product: hub and game share the same palette, pixel
  fonts and bordered-box styling. Don't introduce new UI kits or Tailwind
  for these pages.
- Scores are server-side and shared: `game_scores` (public table) keyed by
  `user_id` + `game_id`, one row per player per game holding their BEST
  COMPLETED score (`GREATEST` upsert — a higher rerun replaces it, a lower
  one doesn't). Only a completed run (the game's `state.ended`) posts a
  score; identity is `req.user` only, never a client-supplied name.
- Score sanity is the registry's `maxScore` per game; anything over is
  rejected, not clamped.
- `usernode-demo` seed data in staging belongs to fake scouts
  (`staging-demo-scout*`), never to the visitor.
