# The Victorian Academy — Design Notes

## Pillars

1. **A living-feeling medieval settlement:** six locations, daily routines, rumours, events, and a visible timeline.
2. **Distinct inhabitants:** every character has an individual voice, knowledge boundaries, relationships, history, memories, and emotional state.
3. **Consequential roleplay:** player choices change trust, fear, concern, anger, curiosity, reputation, access, and quest outcomes.
4. **Authentic 2D historical direction:** grounded European medieval architecture, garments, materials, objects, and restrained colours rather than generic high-fantasy visuals.
5. **Persistent chronicles:** autosaved world state and exportable saves.

## First playable chapter: Ashenford, 1348

Ashenford is a fictional settlement inspired by medieval Europe. The player arrives as one of four backgrounds: a wayfarer, healer's apprentice, merchant's kin, or royal courier.

### Main quest: The Bell at Dusk

A bell is heard after the abbey clapper is removed. The player follows a chain of testimonies: Edmund the physician, Rowan the innkeeper, Margaret the merchant, evidence in the abbey tower, and Brother Anselm. The reveal is that Anselm used a hidden handbell and cord to guide supplies to isolated cottages. The player chooses to protect him, expose the matter, or call a village hearing. Each resolution changes relationships and reputation.

### Side threads

- **A Physician's Ledger:** recover rosemary and clean linen for Edmund, then return them to the infirmary.
- **A Merchant's Promise:** carry Margaret's sealed parcel to Rowan.
- **The Missing Courier:** help Mara investigate a clue left on the north road.
- **The Royal Dispatch:** the courier background carries a sealed letter that can open the way to the keep.

## Political crisis: The Weight of the Crown

The village's grain shortage creates a political conflict that can be investigated independently of the bell mystery.

- **Public grievances:** Margaret, Mara, Rowan and Edmund can raise concerns about grain levies, unpaid cart work, gate deliveries and infirmary supplies.
- **Evidence:** the player can compare market tallies, hear a tavern witness, review Hobb's gate register and inspect infirmary delivery notes. These are separate testimony records, not automatic proof of guilt.
- **The steward's corruption:** a petition with sufficient evidence, grievances and signatures can earn an audience with King Aldric. A royal inquiry reveals a second ledger showing that Steward Alwyn diverted relief grain and altered the public tally.
- **The king's responsibility:** Aldric authorised an emergency reserve but failed to supervise the steward. The player can demand restitution and reform, a temporary council with authority over the crown, or a peaceful abdication and lawful succession.
- **Public movement:** residents can call a peaceful assembly and form the Common Petition. Some support council oversight, some remain loyal to the crown, and others fear instability. A political outcome depends on evidence and broad support rather than one dialogue choice.
- **Persistence:** grievances, evidence, signatures, inquiry status and political outcomes are stored in the local chronicle and migrated safely from older version-1 saves.

The political route is designed around testimony, public pressure, petitioning, hearings and lawful changes of government. It does not turn into a tactical violence simulator.

## Character state model

Each character has a profile, dialogue style, knowledge boundaries, a location schedule, short memory list, and five emotion meters:

- Fear
- Concern
- Anger
- Trust
- Curiosity

The first build stores these values in the local save. Conversation choices and text categories change them. Character opinions are derived from those values.

## Current architecture

- Frontend: static HTML/CSS/JavaScript.
- World scenes: procedural inline SVG illustrations, one per location.
- World simulation: deterministic local state and action-driven time advancement.
- Dialogue: authored character response rules and quest-specific dialogue.
- Persistence: versioned localStorage state and JSON export.

## Planned architecture for the AI-backed version

1. Keep authoritative game state in the game engine. The model may propose dialogue or an action, but the engine validates and applies it.
2. Add a provider adapter on the server so a locally hosted or hosted open-weight model can be changed without rewriting characters or quests.
3. Pass each NPC only the memories and world facts that character has legitimately learned. Never share every character's private knowledge with every other character.
4. Require structured model outputs for dialogue intent, emotional deltas, memory candidates, and proposed actions. Validate every field and apply game-rule checks before updating the save.
5. Add scheduled NPC routines, off-screen conversations, rumour propagation, relationship graphs, quest deadlines, and event simulation in bounded steps.
6. Expand the 2D map with walkable scenes, animated sprite sheets, consistent character art references, sound, and accessibility options.

## Coercion, rumours and royal judgement

NPCs can have specific weaknesses revealed through earlier quest evidence. The dialogue option to threaten disclosure is limited to those discovered facts and can only be used once per character in a chronicle.

- Coercion may win a reluctant statement or a copy of a record, but such material is marked as contested and does not count as independent evidence in court.
- The person threatened may retaliate with a false rumour. Rumours begin as unverified whispers, spread around the market, tavern, gate and keep over subsequent in-game days, and raise royal suspicion.
- Three or more widely repeated false rumours, alongside high royal suspicion, trigger a sealed summons from King Aldric. The player must appear within two days.
- A player can challenge individual rumours at court using at least two independent records and two willing signatories. Two successfully challenged rumours are enough to make a royal appeal.
- If the player fails to answer the summons or cannot defend the accusations, the king orders a death sentence. The consequence is narrated off-screen, without graphic depiction, and closes that chronicle. A new chronicle can then be started.
- Rumour state, blackmail attempts, suspicion, deadlines and judgement outcomes persist in the local save and are safely added to older version-1 chronicles.

The system makes coercion a risky social choice: short-term compliance can cost trust, create contested evidence and damage the player's standing.

## Open-source direction

The application code and original game data are released under the MIT licence. Any language model weights or services integrated later will retain their own licences and terms; an open-weight model is not automatically free to host or unrestricted for every use.
## Bell quest progression repair

The bell mystery begins with Margaret, then advances through Edmund and Rowan. Each character can advance the relevant clue through either a dialogue choice or a typed conversation, including when NOXEN Studio supplies the spoken reply. The tower investigation unlocks only after all three accounts, and the quest is marked resolved after the final conversation with Anselm. Existing version-1 saves retain their current progress.

## Time, suspicion and household life

- Repeatedly passing hours without doing anything draws attention. Residents first question the player behaviour, then a witchcraft rumour may spread and the watch can report it to the Crown.
- A royal summons can be answered with two credible residents willing to act as witnesses. Failure to answer leads to banishment from Ashenford, recorded without graphic violence.
- Residents have distinct social positions: the king, steward, royal officer, clergy, tradespeople and working households. Abdication transfers authority to a temporary council; regency keeps the king but shares power.
- The player can rent a room at the inn, request a peaceful stay from a trusted resident, or attempt an unauthorised entry through a simple game chance. A household may report trespass to Serjeant Hobb; the player must answer the complaint and may pay a fine or face restrictions.
- Lodging, reports, fines, coin, suspicion and the government form are saved locally and migrated into existing version-1 chronicles.
