# The Victorian Academy — Design Notes

## Pillars

1. **A living-feeling medieval settlement:** locations, daily routines, rumours, events, and a visible timeline.
2. **Distinct inhabitants:** every character has their own voice, knowledge, relationships, history, memories, and emotional state.
3. **Consequential roleplay:** player choices change trust, fear, concern, anger, curiosity, reputation, access, and quest outcomes.
4. **Authentic 2D historical direction:** grounded European medieval architecture, garments, materials, objects, and restrained colours rather than generic high-fantasy visuals.
5. **Persistent chronicles:** autosaved world state and exportable saves.

## First playable chapter: Ashenford, 1348

Ashenford is a fictional settlement inspired by medieval Europe. The player arrives as one of four backgrounds: a wayfarer, healer's apprentice, merchant's kin, or royal courier.

### Main quest: The Bell at Dusk

A bell is heard after the abbey clapper is removed. The player follows a chain of testimonies: Edmund the physician, Rowan the innkeeper, Margaret the merchant, physical evidence in the abbey tower, and Brother Anselm. The reveal is that Anselm used a hidden handbell and cord to guide supplies to isolated cottages. The player chooses to protect him, expose the matter, or call a village hearing. Each ending changes relationships and reputation.

### Side threads

- **A Physician's Ledger:** recover rosemary and clean linen for Edmund, then return them to the infirmary.
- **A Merchant's Promise:** carry Margaret's sealed parcel to Rowan.
- **The Missing Courier:** help Mara investigate a clue left on the north road.
- **The Royal Dispatch:** the courier background carries a sealed letter that can be presented at the gate and delivered at the keep.

## Character state model

Each character has a profile, dialogue style, knowledge boundaries, current location, schedule, short memory list, and five emotion meters:

- Fear
- Concern
- Anger
- Trust
- Curiosity

The first build stores these values in the local save. Conversation choices and text categories make small, visible changes.

## Current architecture

- Frontend: static HTML/CSS/JavaScript.
- World simulation: deterministic local state and action-driven time advancement.
- Dialogue: authored character response rules and quest-specific dialogue.
- Persistence: versioned localStorage state; JSON export.
- Art: a generated market-scene environment plus original inline SVG location illustrations and character portraits.

## Planned architecture for the AI-backed version

1. Keep authoritative game state in the game engine. The model may propose dialogue or an action, but the engine validates and applies it.
2. Add a provider adapter on the server so a locally hosted or hosted open-weight model can be changed without rewriting characters or quests.
3. Pass each NPC only the memories and world facts that character has legitimately learned. Never share every character's private knowledge with every other character.
4. Require structured model outputs for dialogue intent, emotional deltas, memory candidates, and proposed actions. Validate every field and apply safety and game-rule checks before updating the save.
5. Add scheduled NPC routines, off-screen conversations, rumour propagation, relationship graphs, quest deadlines, and event simulation in bounded steps.
6. Expand the 2D map with walkable scenes, animated sprite sheets, consistent character art references, sound, and accessibility options.

## Open-source direction

The application code and original game data are released under the MIT licence. Any language model weights or services integrated later will retain their own licences and terms; an open-weight model is not automatically free to host or unrestricted for every use.