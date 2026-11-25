# The Victorian Academy — Ashenford Chronicle

A standalone, offline-first 2D medieval role-playing prototype. Explore Ashenford, meet characters with distinct personalities, follow branching quests, and see how your choices affect their fear, concern, anger, trust, curiosity, and opinion of you.

## Play

1. Open the **[GitHub Pages game](https://hellothiseasytouse-crypto.github.io/the-victorian-academy/)** after Pages deployment completes, or download the repository and open `index.html`.
2. Choose a starting background and enter Ashenford.
3. Travel using **Places of Ashenford**, speak with the inhabitants, and follow the quest journal.

## What's in this first playable build

- 2D point-and-click village exploration with six locations.
- A generated, cinematic Ashenford market environment plus original SVG location scenes and character portraits, all in a muted medieval palette.
- Four starting backgrounds: wayfarer, healer's apprentice, merchant's kin, and royal courier.
- Eight named inhabitants, including a plague physician, merchant, innkeeper, abbey novice, washerwoman, gate serjeant, steward, and king.
- Individual character dialogue styles, knowledge limits, relationship memories, and emotion meters.
- Local free-text reactions to modern slang and modern technology, which characters interpret through their own medieval worldview.
- A main mystery with three possible resolutions, plus side errands and a missing-courier thread.
- A day-and-hour world clock, location schedules, village rumours, events, and an in-game timeline.
- Autosave to the browser's local storage, plus JSON save export.

## Important prototype note

This version is **playable without an API key or internet connection**, but its character dialogue is currently authored and rule-based. It is not yet connected to a live LLM, and the inhabitants do not yet run a full autonomous simulation in the background. The current build provides the playable foundation: game state, locations, quests, dialogue, relationship meters, and persistence. A later AI integration can replace the local reply rules through a server-side model adapter without changing the core world data.

The in-game date and town are fictional and historically inspired. Character beliefs about medicine, disease, and technology are fictional roleplay, not real-world medical guidance.

## Save data

Progress is saved in the current browser on the current device. Use **Export save file** in the left rail or **Settings → Download save** to keep a portable JSON backup. Clearing browser storage will remove the local save unless you exported it.

## Source layout

- `index.html` — app shell and overlays
- `styles.css` — responsive parchment-and-ink game UI
- `game.js` — world data, scenes, character profiles, quests, dialogue, clock, and saves
- `assets/ashenford-market.webp` — generated Ashenford market environment artwork
- `GAME_DESIGN.md` — core design and next implementation stages
- `LICENSE` — MIT licence

No external libraries, paid services, API keys, or remote fonts are required. The bundled environment artwork is loaded locally.