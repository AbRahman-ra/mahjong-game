# Iteratve Thought Process on the Task

## Note: This document it 100% human written, no LLMs are used to generate this file

## 1st Milestone: Read the Task

- I don't know what are Mahjong Tiles
- There is no stack mentioned to write the app in

### Let's try to understand things better

- Let's watch this video [Easiest Mahjong tutorial (for beginners)](https://www.youtube.com/watch?v=pka0nVIahb0)
- A quick video to validate my understanding [Learn how to play mahjong in 2.5 minutes](https://www.youtube.com/watch?v=qpYF-xmNMew)

### Reread the task again

- Feedback: 50% understanding, let's dig deeper
    - What are the names of each tile set? What are dragons, winds, numbers? [Answer](https://en.wikipedia.org/wiki/Mahjong_tiles#Contents)
- From [this page](https://en.wikipedia.org/wiki/Mahjong#Other_variants) and [this page](https://en.wikipedia.org/wiki/American_mahjong) it seems there are multiple variants of the game, so, it's time for AI help 😁
    - Model: Claude Sonnet / Opus 4.6

```md
Prompt: Read this task, is this a specific known variant of Mahong, or it's a custom variant? <ATTACHED_TASK_TEXT>
Answer: This is a **custom/invented variant** — it does not match any known Mahjong game. Here's the breakdown:

**What it borrows from Mahjong:**

- The tile set (number tiles, Dragons, Winds)
- Terminology like "hand," "draw pile," and "discard pile"

**What makes it completely custom:**

The core mechanic — betting **Higher or Lower on the total value of the next hand** — is actually a **card/tile prediction game** in the vein of classic "Hi-Lo" or "Higher or Lower" games (think the card game Acey Deucey or the TV game _Play Your Cards Right_), not Mahjong at all. In real Mahjong, no variant asks players to predict whether the next hand's _total point value_ will be higher or lower.

The other mechanics are also invented:

- **Tile value scaling** (non-number tiles starting at 5 and going up/down based on win/loss history) — doesn't exist in any standard variant
- **Game-over at tile value 0 or 10** — not a Mahjong concept
- **Draw pile exhausting 3 times = game over** — not a Mahjong concept
- **Single-player solo session with a leaderboard** — traditional Mahjong is 4-player

**In short:** The company dressed up a **Hi-Lo prediction/betting game** in Mahjong clothing. They're using Mahjong tiles as the theme/skin, but the actual game logic is an original invention. You don't need any Mahjong domain knowledge to build it — just treat the tiles as numbered/valued cards in a custom deck.
```
