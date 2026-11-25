# The Victorian Academy — Ashenford Chronicle

A standalone, offline-first 2D medieval role-playing prototype. Explore Ashenford, meet inhabitants with distinct personalities, follow branching quests, and see how your choices affect their fear, concern, anger, trust, curiosity, and opinion of you.

## Play online

Once the GitHub Pages workflow has completed, play here:

**https://hellothiseasytouse-crypto.github.io/the-victorian-academy/**

You can also download the repository and open `index.html` in a current browser.

1. Choose a starting background.
2. Enter Ashenford and explore its six locations.
3. Speak with the inhabitants and follow the quest journal.
4. Use the map, timeline, inventory, and autosave features to keep track of your story.

## What's in this first playable build

- 2D point-and-click exploration across six medieval locations.
- Original SVG scene illustrations, with a muted, historically inspired palette.
- Four starting backgrounds: wayfarer, healer's apprentice, merchant's kin, and royal courier.
- Eight named inhabitants: a plague physician, merchant, innkeeper, abbey novice, washerwoman, gate serjeant, steward, and king.
- Individual dialogue styles, knowledge boundaries, character memories, and relationship opinions.
- Five independent emotional meters for each character: fear, concern, anger, trust, and curiosity.
- Free-text reactions to modern slang and technology, interpreted through each character's medieval worldview.
- The main mystery, **The Bell at Dusk**, with three possible resolutions.
- Side quests involving the physician's supplies, a merchant's parcel, and a missing courier.
- A day-and-hour world clock, location schedules, rumours, events, and an in-game timeline.
- Browser autosave using local storage, plus JSON save export.

## Important prototype note

This version is **playable without an API key or internet connection** after the page has loaded. Character dialogue is currently authored and rule-based. It is not yet connected to a live language model, and inhabitants do not yet run a full autonomous simulation in the background. This is the playable foundation: game state, locations, quests, dialogue, relationship meters, and persistence. A future AI integration can replace the local reply rules through a server-side model adapter without rewriting the core world data.

The town and its events are fictional and historically inspired. Character beliefs about medicine, disease, and technology are fictional roleplay, not real-world medical guidance.

## Saving progress

Progress is saved in the current browser on the current device. Use **Export save file** in the left rail or **Settings → Download save** to keep a portable JSON backup. Clearing browser storage removes the local save unless it was exported. GitHub Pages hosting does not provide cloud account sync.

## Source layout

- `index.html` — app shell and overlays
- `styles.css` — responsive parchment-and-ink interface
- `game.js` — world data, scenes, character profiles, quests, dialogue, clock, and saves
- `GAME_DESIGN.md` — core design and next implementation stages
- `LICENSE` — MIT licence

No external libraries, paid services, API keys, or remote fonts are required.